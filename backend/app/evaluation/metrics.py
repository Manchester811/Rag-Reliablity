import re
from collections import Counter

def _tokens(text: str):
    return re.findall(r"[a-z0-9]+", text.lower())

def token_set(text: str):
    return set(_tokens(text))

def overlap(a: str, b: str) -> float:
    a_set, b_set = token_set(a), token_set(b)
    return len(a_set & b_set) / max(1, len(b_set))

def precision_at_k(relevant_ids, retrieved_ids, k):
    retrieved_ids = retrieved_ids[:k]
    if not retrieved_ids:
        return 0.0
    return sum(x in relevant_ids for x in retrieved_ids) / len(retrieved_ids)

def recall_at_k(relevant_ids, retrieved_ids, k):
    if not relevant_ids:
        return 0.0
    return sum(x in relevant_ids for x in retrieved_ids[:k]) / len(relevant_ids)

def reciprocal_rank(relevant_ids, retrieved_ids):
    for i, item in enumerate(retrieved_ids, 1):
        if item in relevant_ids:
            return 1 / i
    return 0.0

def ndcg_at_k(relevant_ids, retrieved_ids, k):
    import math
    score = 0.0
    for i, item in enumerate(retrieved_ids[:k], 1):
        if item in relevant_ids:
            score += 1 / math.log2(i + 1)
    ideal = sum(1 / math.log2(i + 1) for i in range(1, min(k, len(relevant_ids)) + 1))
    return score / ideal if ideal else 0.0

def evaluate(question, expected, answer, retrieved):
    ids = [c.id for c, _ in retrieved]
    evidence = " ".join(c.text for c, _ in retrieved)
    relevant = {c.id for c, _ in retrieved if overlap(c.text, expected) >= 0.2}
    recall = recall_at_k(relevant, ids, len(ids))
    precision = precision_at_k(relevant, ids, len(ids))
    mrr = reciprocal_rank(relevant, ids)
    ndcg = ndcg_at_k(relevant, ids, len(ids))
    faithfulness = min(1.0, overlap(answer, evidence))
    relevance = min(1.0, overlap(answer, expected))
    citation = 1.0 if any(overlap(answer, c.text) >= 0.25 for c, _ in retrieved) else 0.0
    hallucination = 1.0 - faithfulness
    overall = 100 * (
        0.18*recall + 0.12*precision + 0.10*mrr + 0.10*ndcg +
        0.20*faithfulness + 0.15*relevance + 0.10*citation +
        0.05*(1-hallucination)
    )
    return {
        "retrieval_recall": round(recall,4),
        "precision_at_k": round(precision,4),
        "mrr": round(mrr,4),
        "ndcg": round(ndcg,4),
        "faithfulness_proxy": round(faithfulness,4),
        "answer_relevance_proxy": round(relevance,4),
        "citation_accuracy_proxy": round(citation,4),
        "hallucination_rate_proxy": round(hallucination,4),
        "overall": round(overall,2),
    }
