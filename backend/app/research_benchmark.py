import json, csv, statistics, time, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from app.rag import Chunk, DemoRAG
from app.rag.providers import HybridRetriever
from app.evaluation.evaluator import evaluate_full
from benchmark.dataset import DOCUMENTS, make_cases

def chunks():
    return [Chunk(i,t,s) for i,t,s in DOCUMENTS]

def retrieve(rag, mode, question, top_k):
    if mode=="tfidf":
        return rag.retrieve(question,top_k)
    return HybridRetriever(rag.chunks).retrieve(question,top_k)

def run():
    cases=make_cases()
    results=[]
    configs=[
      {"name":"TF-IDF@3","mode":"tfidf","top_k":3},
      {"name":"TF-IDF@5","mode":"tfidf","top_k":5},
      {"name":"Hybrid@3","mode":"hybrid","top_k":3},
      {"name":"Hybrid@5","mode":"hybrid","top_k":5},
    ]
    for cfg in configs:
        rag=DemoRAG(chunks())
        for idx,case in enumerate(cases):
            start=time.perf_counter()
            retrieved=retrieve(rag,cfg["mode"],case["question"],cfg["top_k"])
            answer="I could not find enough evidence in the retrieved context."
            # Deterministic generator: choose highest-ranked evidence sentence.
            if retrieved:
                answer=retrieved[0][0].text.split(":",1)[-1].strip()
            m=evaluate_full(case["question"],case["expected_answer"],answer,retrieved)
            m.update({"config":cfg["name"],"case_id":idx+1,"attack_type":case["attack_type"],
                      "expected_evidence":case["evidence_id"],
                      "latency_ms":round((time.perf_counter()-start)*1000,3)})
            results.append(m)
    out=Path(__file__).resolve().parents[1]/"benchmark_results"
    out.mkdir(exist_ok=True)
    (out/"results.json").write_text(json.dumps(results,indent=2),encoding="utf-8")
    summary=[]
    for cfg in configs:
        rows=[r for r in results if r["config"]==cfg["name"]]
        def avg(k): return round(statistics.mean(r[k] for r in rows),4)
        summary.append({
          "config":cfg["name"],"cases":len(rows),"overall":round(avg("overall"),2),
          "recall":avg("retrieval_recall"),"precision":avg("precision_at_k"),
          "mrr":avg("mrr"),"ndcg":avg("ndcg"),"faithfulness":avg("faithfulness_proxy"),
          "hallucination":avg("hallucination_rate_proxy"),"claim_support":avg("claim_support_rate"),
          "latency_ms":avg("latency_ms")
        })
    (out/"summary.json").write_text(json.dumps(summary,indent=2),encoding="utf-8")
    with open(out/"summary.csv","w",newline="",encoding="utf-8") as f:
        w=csv.DictWriter(f,fieldnames=summary[0].keys()); w.writeheader(); w.writerows(summary)
    # Attack robustness curve
    curve=[]
    for cfg in configs:
        for attack in ["normal","paraphrase","typo","distractor","contradiction","temporal"]:
            rows=[r for r in results if r["config"]==cfg["name"] and r["attack_type"]==attack]
            curve.append({"config":cfg["name"],"attack":attack,
                           "score":round(statistics.mean(r["overall"] for r in rows),2)})
    (out/"robustness_curve.json").write_text(json.dumps(curve,indent=2),encoding="utf-8")
    report=["# RAG Reliability Research Benchmark","","Dataset: 20 base questions × 6 conditions = 120 cases per configuration.",
            "Metrics are computed from the included deterministic corpus; they are baseline research results, not production claims.","",
            "## Configuration summary",""]
    for s in summary:
        report.append(f"- **{s['config']}** — score {s['overall']}, recall {s['recall']}, faithfulness {s['faithfulness']}, hallucination proxy {s['hallucination']}, latency {s['latency_ms']} ms")
    report += ["","## Robustness","", "Robustness is reported separately by attack type so a high aggregate score cannot hide adversarial weaknesses.",
               "See `robustness_curve.json` for machine-readable results."]
    (out/"report.md").write_text("\n".join(report),encoding="utf-8")
    return summary,curve

if __name__=="__main__":
    summary,curve=run()
    print(json.dumps({"summary":summary,"robustness":curve},indent=2))
