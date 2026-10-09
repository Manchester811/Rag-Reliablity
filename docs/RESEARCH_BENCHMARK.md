# Research Benchmark

The included research benchmark uses a deterministic corpus of 20 base questions and six conditions:
normal, paraphrase, typo, distractor, contradiction and temporal.

Each retrieval configuration is evaluated on all 120 cases.

Configurations:
- TF-IDF@3
- TF-IDF@5
- Hybrid@3
- Hybrid@5

The benchmark produces:
- `benchmark_results/results.json`
- `benchmark_results/summary.json`
- `benchmark_results/summary.csv`
- `benchmark_results/robustness_curve.json`
- `benchmark_results/report.md`

Run:

```powershell
cd backend
python -m app.research_benchmark
```

These numbers are reproducible baseline measurements on the included corpus. They must not be presented as universal RAG performance claims.
