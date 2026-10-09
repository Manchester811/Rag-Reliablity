# Advanced RAG

## Cross-encoder reranking

Set:

```text
RERANK_PROVIDER=cross_encoder
RERANK_MODEL=cross-encoder/ms-marco-MiniLM-L-6-v2
```

The reranker is optional. If the model cannot load, the endpoint safely falls back to the base retriever.

## Optional LLM generation

Set:

```text
RAG_PROVIDER=openai
OPENAI_API_KEY=...
RAG_MODEL=gpt-4o-mini
```

The prompt requires answers to stay inside retrieved evidence and cite sources as `[Source N]`.

## Robustness

The RAG Playground has an **Attack query** action that generates adversarial variants of the current question. This is the beginning of interactive per-document robustness testing.
