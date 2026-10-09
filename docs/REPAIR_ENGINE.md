# RAG Repair Engine

The Repair Lab formalizes the project's core research loop:

```text
benchmark → diagnose → propose repair → rerun → compare
```

Candidate interventions currently include:
- Top-K 3
- Top-K 5
- Hybrid retrieval
- Cross-encoder reranking

The API deliberately treats repairs as experiments. A repair is only considered
successful when its measured score improves against the same baseline cases.

Endpoints:
- `GET /api/repairs/candidates`
- `POST /api/repairs/diagnose`
- `POST /api/repairs/compare`
