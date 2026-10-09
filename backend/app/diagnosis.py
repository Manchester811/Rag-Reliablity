def diagnose(metrics, attack_type="normal"):
    if metrics["retrieval_recall"] < 1:
        return ("retrieval_failure","Relevant evidence was not reliably retrieved.",
                0.91,"Increase top_k, use hybrid retrieval, or add reranking.")
    if metrics["precision_at_k"] < .34:
        return ("ranking_failure","Retrieved context contains too much irrelevant evidence.",
                .86,"Add a reranker or improve metadata-aware ranking.")
    if metrics["faithfulness_proxy"] < .45:
        return ("grounding_failure","Generated content has weak support in retrieved evidence.",
                .89,"Use grounded generation and claim-level evidence checks.")
    if metrics["citation_accuracy_proxy"] < 1:
        return ("citation_failure","The answer does not map cleanly to supporting evidence.",
                .82,"Require evidence-backed claims and citation validation.")
    if metrics["answer_relevance_proxy"] < .35:
        return ("answer_relevance_failure","The answer is poorly aligned with the expected answer.",
                .84,"Improve query understanding or generation.")
    if attack_type in {"temporal","contradiction"} and metrics["hallucination_rate_proxy"] > .15:
        return ("robustness_failure","The RAG becomes unreliable under adversarial knowledge conditions.",
                .83,"Add temporal/authority-aware ranking and contradiction handling.")
    return ("no_critical_failure","No critical failure detected by the heuristic evaluator.",
            .75,"Continue monitoring with a larger benchmark.")
