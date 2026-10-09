# Evaluation Methodology

The MVP provides deterministic lexical proxies plus standard retrieval metrics.

Retrieval:
- Recall@K
- Precision@K
- MRR
- NDCG

Generation:
- Faithfulness proxy
- Answer relevance proxy
- Citation accuracy proxy
- Hallucination-rate proxy

Performance:
- Retrieval/execution latency

Proxy metrics are intentionally named as proxies. A future research-grade configuration should add model-based judges and human annotations.
