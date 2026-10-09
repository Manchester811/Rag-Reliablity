# RAG Reliability Research Benchmark

Dataset: 20 base questions × 6 conditions = 120 cases per configuration.
Metrics are computed from the included deterministic corpus; they are baseline research results, not production claims.

## Configuration summary

- **TF-IDF@3** — score 57.18, recall 0.5333, faithfulness 0.4933, hallucination proxy 0.5067, latency 0.4421 ms
- **TF-IDF@5** — score 53.87, recall 0.5417, faithfulness 0.3878, hallucination proxy 0.6122, latency 0.4524 ms
- **Hybrid@3** — score 57.94, recall 0.5333, faithfulness 0.504, hallucination proxy 0.496, latency 1.1597 ms
- **Hybrid@5** — score 53.89, recall 0.5417, faithfulness 0.3776, hallucination proxy 0.6224, latency 1.2383 ms

## Robustness

Robustness is reported separately by attack type so a high aggregate score cannot hide adversarial weaknesses.
See `robustness_curve.json` for machine-readable results.