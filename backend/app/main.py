import json
import os
from fastapi import FastAPI,HTTPException,UploadFile,File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .db import init_db,connect
from .service import rows
from .models import AttackRequest,RepairRequest,ExperimentRequest,AskRequest
from .attacks import generate_attacks
from .rag.chunking import recursive
from .experiment_engine import create_experiment
from .documents import validate,extract_text,extract_pages

class RepairExperimentRequest(BaseModel):
    baseline_score: float
    candidate_score: float
    candidate_name: str
    notes: str = ""
init_db()
app=FastAPI(title="RAG Reliability Lab",version="1.0.0")
allowed_origins = ["http://localhost:3000","http://localhost:3001","http://127.0.0.1:3000"]
if os.getenv("NGROK_URL"):
    allowed_origins.append(os.getenv("NGROK_URL"))
if os.getenv("CORS_ORIGIN"):
    allowed_origins.append(os.getenv("CORS_ORIGIN"))
app.add_middleware(CORSMiddleware,allow_origins=allowed_origins,allow_credentials=True,allow_methods=["*"],allow_headers=["*"])
def health(): return {"status":"ok","service":"rag-reliability-lab","version":"1.0.0"}

@app.get("/api/dashboard")
def dashboard():
    exps=rows("SELECT * FROM experiments ORDER BY id DESC"); failures=rows("SELECT * FROM failures ORDER BY id DESC"); runs=rows("SELECT * FROM runs")
    latest=exps[0] if exps else None
    return {"overall_score":latest["overall_score"] if latest else 0,"experiments":len(exps),"tests":len(runs),
            "failures":len(failures),"critical_failures":sum(f["failure_type"] in ("retrieval_failure","grounding_failure","robustness_failure") for f in failures)}


@app.post("/api/documents/upload")
async def upload_document(file: UploadFile=File(...)):
    import tempfile, os
    from datetime import datetime, timezone
    init_db()
    original_name=file.filename or "document"
    suffix=os.path.splitext(original_name)[1].lower()
    if suffix not in {".txt",".md",".pdf",".csv"}:
        raise HTTPException(400,"Unsupported file type")
    data=await file.read()
    if len(data)>10*1024*1024:
        raise HTTPException(413,"File exceeds 10 MB limit")
    with tempfile.NamedTemporaryFile(delete=False,suffix=suffix) as tmp:
        tmp.write(data)
        path=tmp.name
    try:
        meta=validate(path)
        pages=extract_pages(path)
    except Exception as exc:
        os.unlink(path)
        raise HTTPException(400,str(exc))
    os.unlink(path)

    chunks=[]
    for page,text in pages:
        for chunk in recursive(text,size=180,overlap=30):
            if chunk.strip():
                chunks.append((page,chunk.strip()))

    with connect() as c:
        try:
            c.execute("""INSERT INTO documents
                (name,file_type,size_bytes,sha256,chunk_count,status,created_at)
                VALUES(?,?,?,?,?,?,?)""",
                (original_name,meta["type"],meta["size"],meta["hash"],len(chunks),
                 "processed",datetime.now(timezone.utc).isoformat()))
            doc_id=c.execute("SELECT last_insert_rowid()").fetchone()[0]
            for i,(page,chunk) in enumerate(chunks):
                c.execute("""INSERT INTO document_chunks
                    (document_id,chunk_index,page_number,text,created_at)
                    VALUES(?,?,?,?,?)""",
                    (doc_id,i,page,chunk,datetime.now(timezone.utc).isoformat()))
        except Exception as exc:
            raise HTTPException(409,f"Document already exists or could not be stored: {exc}")
    return {
        "status":"processed",
        "document_id":doc_id,
        "document":{"name":original_name,"size":meta["size"],"hash":meta["hash"],"type":meta["type"]},
        "pages":len(pages),
        "chunk_count":len(chunks)
    }

@app.get("/api/documents")
def documents():
    return rows("SELECT * FROM documents ORDER BY id DESC")


@app.get("/api/research/benchmark")
def research_benchmark():
    from pathlib import Path
    root=Path(__file__).resolve().parents[1]/"../benchmark_results"
    out={}
    for name in ["summary.json","robustness_curve.json"]:
        p=root/name
        if p.exists(): out[name]=json.loads(p.read_text(encoding="utf-8"))
    return out

@app.get("/api/documents/{document_id}/chunks")
def document_chunks(document_id:int):
    docs=rows("SELECT * FROM documents WHERE id=?",(document_id,))
    if not docs:
        raise HTTPException(404,"Document not found")
    return rows("""SELECT id,chunk_index,page_number,text
                   FROM document_chunks WHERE document_id=?
                   ORDER BY chunk_index""",(document_id,))


@app.post("/api/rag/production-ask")
def production_ask(req:AskRequest):
    docs=rows("SELECT * FROM documents WHERE id=?",(req.document_id,))
    if not docs: raise HTTPException(404,"Document not found")
    raw=rows("""SELECT id,page_number,text FROM document_chunks
                WHERE document_id=? ORDER BY chunk_index""",(req.document_id,))
    if not raw: raise HTTPException(400,"Document has no extractable text")
    from .rag import Chunk
    chunks=[Chunk(str(x["id"]),x["text"],docs[0]["name"]) for x in raw]
    mode=os.getenv("PRODUCTION_RETRIEVAL","lexical").lower()
    if mode=="dense":
        try:
            from .rag.production import DenseRetriever
            retrieved=DenseRetriever(chunks).retrieve(req.question,req.top_k)
        except Exception as exc:
            raise HTTPException(503,f"Dense retrieval unavailable: {exc}")
    elif mode=="hybrid_dense":
        try:
            from .rag.production import hybrid_dense_lexical
            retrieved=hybrid_dense_lexical(chunks,req.question,req.top_k)
        except Exception as exc:
            raise HTTPException(503,f"Dense hybrid retrieval unavailable: {exc}")
    else:
        from .rag.providers import HybridRetriever
        retrieved=HybridRetriever(chunks).retrieve(req.question,req.top_k)

    sources=[]
    for c,score in retrieved:
        row=next(x for x in raw if str(x["id"])==str(c.id))
        sources.append({"chunk_id":row["id"],"page":row["page_number"],
                        "score":round(float(score),5),"text":row["text"]})
    answer=sources[0]["text"] if sources else "No evidence found."
    mode=os.getenv("RAG_PROVIDER","local").lower()
    if mode=="openai" and os.getenv("OPENAI_API_KEY"):
        try:
            from .rag.advanced import OpenAIAnswerGenerator
            answer=OpenAIAnswerGenerator().generate(req.question,sources)
            mode="openai"
        except Exception:
            mode="local-fallback"
    return {"document":docs[0],"question":req.question,"answer":answer,
            "sources":sources,"retrieval_mode":os.getenv("PRODUCTION_RETRIEVAL","lexical"),
            "generation_mode":mode}

@app.post("/api/rag/ask")
def rag_ask(req:AskRequest):
    if req.top_k<1 or req.top_k>20:
        raise HTTPException(400,"top_k must be between 1 and 20")
    docs=rows("SELECT * FROM documents WHERE id=?",(req.document_id,))
    if not docs:
        raise HTTPException(404,"Document not found")
    chunks=rows("""SELECT id,chunk_index,page_number,text
                   FROM document_chunks WHERE document_id=?
                   ORDER BY chunk_index""",(req.document_id,))
    if not chunks:
        raise HTTPException(400,"Document has no extractable text")

    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
    texts=[x["text"] for x in chunks]
    vectorizer=TfidfVectorizer(stop_words="english")
    matrix=vectorizer.fit_transform(texts+[req.question])
    scores=cosine_similarity(matrix[-1],matrix[:-1])[0]
    candidates=sorted(zip(chunks,scores),key=lambda x:float(x[1]),reverse=True)[:max(req.top_k,8)]
    rerank_used=False
    if os.getenv("RERANK_PROVIDER","local").lower()=="cross_encoder":
        try:
            from .rag.advanced import CrossEncoderReranker
            from .rag import Chunk
            candidate_objects=[(Chunk(str(c["id"]),c["text"],docs[0]["name"]),float(score)) for c,score in candidates]
            reranked=CrossEncoderReranker().rerank(req.question,candidate_objects,req.top_k)
            candidates=[(chunks[[str(x["id"]) for x in chunks].index(c.id)],score) for c,score in reranked]
            rerank_used=True
        except Exception:
            candidates=candidates[:req.top_k]

    sources=[{
        "chunk_id":c["id"],
        "page":c["page_number"],
        "score":round(float(score),4),
        "text":c["text"]
    } for c,score in candidates[:req.top_k]]

    answer="I could not find enough evidence in this document to answer confidently."
    mode="local"
    if sources and sources[0]["score"]>0:
        answer=sources[0]["text"]
    if os.getenv("RAG_PROVIDER","local").lower()=="openai" and os.getenv("OPENAI_API_KEY"):
        try:
            from .rag.advanced import OpenAIAnswerGenerator
            answer=OpenAIAnswerGenerator().generate(req.question,sources)
            mode="openai"
        except Exception:
            mode="local-fallback"

    return {
        "document":docs[0],
        "question":req.question,
        "answer":answer,
        "sources":sources,
        "generation_mode":mode,
        "reranker_used":rerank_used,
        "evaluation_note":"Retrieval scores are reproducible local scores. LLM generation is optional and requires an API key."
    }



@app.post("/api/rag/attack")
def rag_attack(req:AskRequest):
    """Generate deterministic variants of the user's query for quick robustness checks."""
    from .attacks import generate_attacks
    attacks=generate_attacks(req.question)
    return {"question":req.question,"attacks":attacks}


@app.post("/api/repairs/diagnose")
def repair_diagnose(payload: dict):
    from .repair_engine import diagnose
    return diagnose(payload)

@app.post("/api/repairs/compare")
def repair_compare(req:RepairExperimentRequest):
    from .repair_engine import compare
    return {"candidate_name":req.candidate_name,
            "notes":req.notes,
            **compare({"overall":req.baseline_score},{"overall":req.candidate_score})}




@app.post("/api/research/self-improve")
def self_improve(payload: dict):
    from .self_improvement import run_self_improvement
    return run_self_improvement(float(payload.get("baseline_score",0)), payload.get("diagnosis",{}))

@app.post("/api/research/auto-optimize")
def auto_optimize():
    from .auto_optimizer import run_optimizer
    return run_optimizer()

@app.post("/api/research/paired-stats")
def paired_stats(payload: dict):
    from .research_stats import paired_stats
    return paired_stats(payload.get("baseline",[]),payload.get("candidate",[]))

@app.get("/api/repairs/candidates")
def repair_candidates():
    from .repair_engine import CANDIDATES
    return [{"name":x.name,"description":x.description,"config":x.config} for x in CANDIDATES]

@app.get("/api/experiments")
def experiments(): return rows("SELECT * FROM experiments ORDER BY id DESC")

@app.post("/api/experiments")
def run_experiment(req:ExperimentRequest):
    eid,(results,total_ms)=create_experiment(req.name,req.attack_types,req.severity,req.top_k)
    return {"experiment_id":eid,"results":results,"duration_ms":round(total_ms,2)}

@app.post("/api/experiments/demo")
def demo():
    eid,(results,total_ms)=create_experiment("Demo Reliability Baseline",
        ["paraphrase","typo","temporal","contradiction","multi-hop","distractor"],"medium",3)
    return {"experiment_id":eid,"results":results,"duration_ms":round(total_ms,2)}


@app.get("/api/experiments/compare")
def compare_experiments():
    exps=rows("SELECT id,name,overall_score,status,created_at,config_json FROM experiments ORDER BY id DESC")
    for e in exps:
        e["config"]=json.loads(e.pop("config_json"))
    return {"experiments":exps}

@app.get("/api/experiments/{experiment_id}")
def experiment(experiment_id:int):
    exp=rows("SELECT * FROM experiments WHERE id=?",(experiment_id,))
    if not exp: raise HTTPException(404,"Experiment not found")
    runs=rows("SELECT * FROM runs WHERE experiment_id=? ORDER BY id",(experiment_id,))
    for r in runs:
        r["metrics"]=json.loads(r["metrics_json"]); r["retrieved"]=json.loads(r["retrieved_json"])
    return {"experiment":exp[0],"runs":runs}

@app.get("/api/failures")
def failures():
    out=rows("SELECT * FROM failures ORDER BY id DESC")
    for x in out: x["reproduction"]=json.loads(x["reproduction_json"])
    return out

@app.get("/api/failures/{failure_id}")
def failure(failure_id:int):
    out=rows("SELECT * FROM failures WHERE id=?",(failure_id,))
    if not out: raise HTTPException(404,"Failure not found")
    x=out[0]; x["reproduction"]=json.loads(x["reproduction_json"]); return x

@app.post("/api/attacks/generate")
def attacks(req:AttackRequest):
    if req.severity not in {"low","medium","high","critical"}: raise HTTPException(400,"Invalid severity")
    return generate_attacks(req.question,req.expected_answer,req.attack_types,req.severity)

@app.post("/api/repairs/suggest")
def repairs(req:RepairRequest):
    mapping={
      "retrieval_failure":["Increase top_k","Enable hybrid BM25 + dense retrieval","Add a cross-encoder reranker"],
      "ranking_failure":["Add a reranker","Use metadata-aware ranking","Reduce distractor context"],
      "grounding_failure":["Use claim-level citation prompting","Add a model-based faithfulness judge","Require supporting evidence"],
      "robustness_failure":["Add temporal/authority-aware ranking","Add contradiction handling","Increase adversarial test coverage"]
    }
    return {"failure_type":req.failure_type,"suggestions":mapping.get(req.failure_type,["Generate targeted tests","Compare a second retriever","Review evaluation traces"])}
