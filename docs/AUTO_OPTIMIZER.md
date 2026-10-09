# Auto-Optimizer

The Auto-Optimizer executes the same benchmark against each included retrieval
configuration and ranks candidates by the aggregate reliability score.

Current candidates:
- TF-IDF@3
- TF-IDF@5
- Hybrid@3
- Hybrid@5

Run:

```powershell
cd backend
python -m app.auto_optimizer
```

or use the **Run optimizer** button in the dashboard.

The optimizer is deliberately benchmark-specific. It reports the best candidate
on the supplied corpus and cases rather than claiming that one RAG architecture
is universally optimal.
