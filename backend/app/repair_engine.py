"""Automated RAG repair experiment engine.

Repairs are configuration-level interventions, not claims that a repair always
improves quality. Each candidate is evaluated against the same cases.
"""
from dataclasses import dataclass
from typing import Any

@dataclass
class RepairCandidate:
    name: str
    description: str
    config: dict[str,Any]

CANDIDATES=[
    RepairCandidate("Top-K 3","Reduce context to the three highest-ranked chunks.",{"top_k":3}),
    RepairCandidate("Top-K 5","Use five retrieved chunks for broader recall.",{"top_k":5}),
    RepairCandidate("Hybrid retrieval","Combine TF-IDF similarity with token overlap.",{"retrieval":"hybrid","top_k":3}),
    RepairCandidate("Cross-encoder reranking","Rerank retrieved candidates before generation.",{"reranker":"cross_encoder","top_k":3}),
]

def diagnose(metrics):
    if metrics.get("faithfulness_proxy",1)<0.5:
        return {"failure":"grounding","recommendation":"Reduce noisy context or add reranking."}
    if metrics.get("retrieval_recall",1)<0.5:
        return {"failure":"retrieval","recommendation":"Increase recall or use hybrid/dense retrieval."}
    if metrics.get("citation_accuracy_proxy",1)<0.7:
        return {"failure":"citation","recommendation":"Add claim-level evidence verification."}
    return {"failure":"none","recommendation":"No obvious repair required."}

def compare(baseline, candidate):
    delta=round(candidate["overall"]-baseline["overall"],4)
    return {"baseline":baseline["overall"],"candidate":candidate["overall"],
            "delta":delta,"improved":delta>0}


class ExperimentLedger:
    """In-memory research ledger for a reproducible before/after record."""
    def __init__(self):
        self.records=[]
    def add(self, candidate_name, baseline, candidate, stats=None):
        record={"candidate":candidate_name,"baseline":baseline,"candidate_score":candidate,
                "delta":round(candidate-baseline,4),"stats":stats or {}}
        record["status"]="improved" if record["delta"]>0 else ("unchanged" if record["delta"]==0 else "regressed")
        self.records.append(record)
        return record
    def best(self):
        return max(self.records,key=lambda x:x["candidate_score"]) if self.records else None
