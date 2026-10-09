import json, time
from datetime import datetime, timezone
from .db import connect, init_db
from .rag import DemoRAG, Chunk
from .evaluation.evaluator import evaluate_full
from .diagnosis import diagnose

DOCS=[
 Chunk("c1","Apple revenue 2024: Apple reported total revenue of 391 billion dollars in fiscal 2024.","annual-report-2024"),
 Chunk("c2","Apple revenue 2023: Apple reported total revenue of 383 billion dollars in fiscal 2023.","annual-report-2023"),
 Chunk("c3","Apple products: iPhone, Mac, iPad, Apple Watch and services are major product categories.","company-profile"),
 Chunk("c4","Apple services: Services revenue includes the App Store, cloud services, subscriptions and advertising.","services-report"),
 Chunk("c5","Apple history: The company was founded by Steve Jobs, Steve Wozniak and Ronald Wayne in 1976.","history"),
 Chunk("c6","Distractor: A 2021 report discusses revenue from an unrelated company and should not answer Apple revenue questions.","distractor"),
]
QUESTIONS=[
 ("What was Apple's revenue in 2024?","391 billion dollars"),
 ("Who founded Apple?","Steve Jobs, Steve Wozniak and Ronald Wayne"),
 ("What does Apple Services revenue include?","App Store, cloud services, subscriptions and advertising"),
 ("What was Apple's revenue in 2023?","383 billion dollars"),
]
def now(): return datetime.now(timezone.utc).isoformat()

def run_cases(experiment_id,cases,top_k=3):
    rag=DemoRAG(DOCS); results=[]; started=time.perf_counter()
    with connect() as c:
        for case in cases:
            t=time.perf_counter()
            answer,retrieved=rag.answer(case["question"],top_k)
            latency=(time.perf_counter()-t)*1000
            metrics=evaluate_full(case["question"],case["expected_answer"],answer,retrieved)
            metrics["latency_ms"]=round(latency,2)
            passed=int(metrics["overall"]>=70)
            c.execute("""INSERT INTO test_cases(experiment_id,question,expected_answer,attack_type,metadata_json)
                         VALUES(?,?,?,?,?)""",(experiment_id,case["question"],case["expected_answer"],
                         case.get("attack_type","normal"),json.dumps({"severity":case.get("severity","normal")})))
            tcid=c.execute("SELECT last_insert_rowid()").fetchone()[0]
            retrieved_json=json.dumps([{"id":x.id,"text":x.text,"source":x.source,"score":s} for x,s in retrieved])
            c.execute("""INSERT INTO runs(experiment_id,test_case_id,answer,retrieved_json,metrics_json,passed,created_at)
                         VALUES(?,?,?,?,?,?,?)""",(experiment_id,tcid,answer,retrieved_json,json.dumps(metrics),passed,now()))
            rid=c.execute("SELECT last_insert_rowid()").fetchone()[0]
            if not passed:
                ft,root,conf,rec=diagnose(metrics,case.get("attack_type","normal"))
                reproduction={"question":case["question"],"expected_answer":case["expected_answer"],
                              "attack_type":case.get("attack_type","normal"),"severity":case.get("severity","normal"),
                              "top_k":top_k,"retrieved_chunk_ids":[x.id for x,_ in retrieved]}
                c.execute("""INSERT INTO failures(run_id,failure_type,root_cause,confidence,recommendation,
                             reproduction_json,created_at) VALUES(?,?,?,?,?,?,?)""",
                          (rid,ft,root,conf,rec,json.dumps(reproduction),now()))
            results.append(metrics)
        avg=sum(x["overall"] for x in results)/max(1,len(results))
        total_ms=(time.perf_counter()-started)*1000
        c.execute("UPDATE experiments SET overall_score=?,status=? WHERE id=?",(round(avg,2),"completed",experiment_id))
    return results,total_ms

def create_experiment(name="Reliability Baseline",attack_types=None,severity="medium",top_k=3):
    from .attacks import generate_attacks
    init_db()
    with connect() as c:
        c.execute("INSERT INTO experiments(name,config_json,status,created_at) VALUES(?,?,?,?)",
                  (name,json.dumps({"top_k":top_k,"severity":severity,"attack_types":attack_types or []}),"running",now()))
        eid=c.execute("SELECT last_insert_rowid()").fetchone()[0]
    cases=[{"question":q,"expected_answer":a,"attack_type":"normal"} for q,a in QUESTIONS]
    if attack_types:
        cases += generate_attacks(QUESTIONS[0][0],QUESTIONS[0][1],attack_types,severity)
    return eid,run_cases(eid,cases,top_k)
