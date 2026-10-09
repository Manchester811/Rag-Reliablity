# Research Methodology

The project now separates three kinds of evidence:

1. **Retrieval metrics** — recall, precision@k, MRR and NDCG.
2. **Grounding proxies** — transparent local heuristics, not LLM-judge truth.
3. **Repair evidence** — paired before/after comparisons on the same cases.

The paired comparison utility reports:
- mean delta
- standard deviation
- standard error
- approximate 95% confidence interval
- percentage of paired cases that improved

The confidence interval is a normal approximation and should be described that way in academic or resume material.

## Important reporting rule

Do not claim that a configuration is universally better from the included synthetic corpus. Report the corpus, number of cases, configuration and metric when presenting results.
