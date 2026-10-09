import re

def tokens(text):
    return set(re.findall(r"[a-z0-9]+", text.lower()))

def overlap(a, b):
    ta, tb = tokens(a), tokens(b)
    return len(ta & tb) / max(1, len(tb))

def evaluate(question, expected, answer, retrieved):
    retrieved_text = " ".join(c.text for c, _ in retrieved)
    recall = 1.0 if overlap(retrieved_text, expected) >= 0.35 else 0.0
    relevance = min(1.0, overlap(answer, expected))
    faithfulness = min(1.0, overlap(answer, retrieved_text))
    hallucination = max(0.0, 1.0 - faithfulness)
    precision = sum(overlap(c.text, expected) >= 0.2 for c, _ in retrieved) / max(1, len(retrieved))
    overall = 100 * (0.25*recall + 0.20*precision + 0.25*faithfulness + 0.30*relevance)
    return {
        "retrieval_recall": round(recall, 4),
        "context_precision": round(precision, 4),
        "faithfulness_proxy": round(faithfulness, 4),
        "answer_relevance_proxy": round(relevance, 4),
        "hallucination_rate_proxy": round(hallucination, 4),
        "overall": round(overall, 2)
    }

def diagnose(metrics):
    if metrics["retrieval_recall"] < 1:
        return ("retrieval_failure",
                "Relevant evidence was not sufficiently represented in the retrieved context.",
                0.91,
                "Increase top_k or switch to hybrid/dense retrieval.")
    if metrics["faithfulness_proxy"] < 0.45:
        return ("grounding_failure",
                "The answer has weak support in retrieved evidence.",
                0.87,
                "Use a stronger grounded generation prompt or model-based faithfulness judge.")
    if metrics["answer_relevance_proxy"] < 0.35:
        return ("answer_failure",
                "The answer has weak overlap with the expected answer.",
                0.84,
                "Improve query understanding and answer generation.")
    if metrics["context_precision"] < 0.34:
        return ("ranking_failure",
                "Too much low-value context appears alongside relevant evidence.",
                0.82,
                "Add a reranker or improve retrieval ranking.")
    return ("no_critical_failure",
            "No critical failure detected by the MVP heuristics.",
            0.75,
            "Keep monitoring with a larger benchmark.")
