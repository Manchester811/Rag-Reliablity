# Providers

The project works offline by default.

## Hybrid retrieval
The default upgraded retriever combines TF-IDF cosine similarity with token overlap. It requires no model download.

## Dense retrieval
Install optional dependencies:

```powershell
pip install -r requirements-optional.txt
```

Then use `DenseRetriever` with `sentence-transformers`.

## LLM judge
Set:

```text
EVAL_PROVIDER=openai
OPENAI_API_KEY=...
EVAL_MODEL=gpt-4o-mini
```

Without these variables the system uses a deterministic lexical proxy and labels it as such.
