"""Automated RAG configuration optimizer.

This module ranks candidate retrieval configurations on the included benchmark.
It intentionally does not claim universal optimality: it reports the best
configuration for the benchmark corpus and test cases actually executed.
"""
import json, statistics, time
from pathlib import Path
import sys
ROOT=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(ROOT))
from .rag import Chunk, DemoRAG
from .rag.providers import HybridRetriever
from .evaluation.evaluator import evaluate_full
from benchmark.dataset import DOCUMENTS, make_cases

CONFIGS=[
    {"name":"TF-IDF@3","mode":"tfidf","top_k":3},
    {"name":"TF-IDF@5","mode":"tfidf","top_k":5},
    {"name":"Hybrid@3","mode":"hybrid","top_k":3},
    {"name":"Hybrid@5","mode":"hybrid","top_k":5},
]

def _retrieve(rag,cfg,q):
    if cfg["mode"]=="tfidf":
        return rag.retrieve(q,cfg["top_k"])
    return HybridRetriever(rag.chunks).retrieve(q,cfg["top_k"])

def run_optimizer():
    cases=make_cases()
    all_rows=[]
    for cfg in CONFIGS:
        rag=DemoRAG([Chunk(i,t,s) for i,t,s in DOCUMENTS])
        for i,case in enumerate(cases):
            t=time.perf_counter()
            retrieved=_retrieve(rag,cfg,case["question"])
            answer=retrieved[0][0].text.split(":",1)[-1].strip() if retrieved else "No evidence."
            m=evaluate_full(case["question"],case["expected_answer"],answer,retrieved)
            m.update({"config":cfg["name"],"case_id":i+1,"attack_type":case["attack_type"],
                      "latency_ms":(time.perf_counter()-t)*1000})
            all_rows.append(m)

    summaries=[]
    for cfg in CONFIGS:
        rows=[r for r in all_rows if r["config"]==cfg["name"]]
        summaries.append({
            "config":cfg["name"],
            "cases":len(rows),
            "overall":round(statistics.mean(r["overall"] for r in rows),4),
            "recall":round(statistics.mean(r["retrieval_recall"] for r in rows),4),
            "precision":round(statistics.mean(r["precision_at_k"] for r in rows),4),
            "faithfulness":round(statistics.mean(r["faithfulness_proxy"] for r in rows),4),
            "hallucination":round(statistics.mean(r["hallucination_rate_proxy"] for r in rows),4),
            "latency_ms":round(statistics.mean(r["latency_ms"] for r in rows),4),
        })
    ranking=sorted(summaries,key=lambda x:x["overall"],reverse=True)
    result={
        "benchmark_cases_per_config":len(cases),
        "configurations_tested":len(CONFIGS),
        "total_evaluations":len(all_rows),
        "ranking":ranking,
        "winner":ranking[0],
        "selection_rule":"highest aggregate benchmark overall score",
        "warning":"Winner is benchmark-specific; it is not a universal RAG optimum."
    }
    out=Path(__file__).resolve().parents[1]/"benchmark_results"
    out.mkdir(exist_ok=True)
    (out/"optimizer_results.json").write_text(json.dumps(result,indent=2),encoding="utf-8")
    return result

if __name__=="__main__":
    print(json.dumps(run_optimizer(),indent=2))
