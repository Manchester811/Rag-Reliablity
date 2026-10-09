# Self-Improvement Loop

The platform now has a conservative closed-loop experiment:

```text
failure diagnosis
    ↓
repair selection
    ↓
benchmark candidate
    ↓
compare against baseline
    ↓
accept only if score improves
```

Endpoint:

`POST /api/research/self-improve`

The system is explicit that a repair decision is benchmark-specific. It does
not claim that a repair universally improves RAG systems.
