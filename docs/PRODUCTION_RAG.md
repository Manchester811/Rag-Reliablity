# Production RAG

The project now supports three retrieval modes for uploaded documents:

- `lexical` — lightweight local hybrid/lexical retrieval.
- `dense` — SentenceTransformer embeddings.
- `hybrid_dense` — lexical + dense retrieval fused with Reciprocal Rank Fusion.

Optional grounded generation uses the OpenAI provider when `RAG_PROVIDER=openai`
and `OPENAI_API_KEY` are set.

Recommended local configuration:

```text
PRODUCTION_RETRIEVAL=hybrid_dense
RAG_PROVIDER=openai
OPENAI_API_KEY=...
RAG_MODEL=gpt-4o-mini
```

If you do not want external APIs or model downloads, keep the defaults.
