"""Closed-loop RAG repair selector.

The engine is intentionally conservative: it only accepts a repair when the
candidate's measured benchmark score is strictly higher than the baseline.
"""
from dataclasses import dataclass
from .repair_engine import CANDIDATES
from .auto_optimizer import run_optimizer

@dataclass
class RepairDecision:
    baseline: float
    candidate: str
    candidate_score: float
    delta: float
    decision: str
    reason: str

def choose_repair(diagnosis: dict):
    failure=diagnosis.get("failure","none")
    if failure=="grounding":
        return "Top-K 3"
    if failure=="retrieval":
        return "Hybrid@3"
    if failure=="citation":
        return "Cross-encoder reranking"
    return None

def run_self_improvement(baseline_score: float, diagnosis: dict):
    selected=choose_repair(diagnosis)
    if not selected:
        return {"status":"no_action","decision":"keep_baseline",
                "reason":"No actionable failure detected."}
    result=run_optimizer()
    lookup={x["config"]:x for x in result["ranking"]}
    candidate_name=selected
    # The reranker is not part of the deterministic optimizer yet, so fall back
    # to the strongest measured candidate when it is selected.
    if candidate_name not in lookup:
        candidate_name=result["winner"]["config"]
    candidate_score=float(lookup[candidate_name]["overall"])
    delta=candidate_score-float(baseline_score)
    decision="accept_repair" if delta>0 else "reject_repair"
    return {
        "status":"completed",
        "diagnosis":diagnosis,
        "selected_repair":selected,
        "evaluated_configuration":candidate_name,
        "baseline_score":round(float(baseline_score),4),
        "candidate_score":round(candidate_score,4),
        "delta":round(delta,4),
        "decision":decision,
        "reason":"Accepted only because the measured candidate score improved." if delta>0
                 else "Rejected because the candidate did not improve the measured score.",
        "benchmark_warning":result["warning"]
    }
