# RAG Reliability Lab

An end-to-end **RAG reliability engineering and research platform** that evaluates, attacks, diagnoses, repairs, and optimizes retrieval-augmented generation systems.

## What was built

- PDF / TXT / Markdown / CSV ingestion
- Page-aware chunking
- Local lexical and hybrid retrieval
- Optional dense SentenceTransformer retrieval
- Reciprocal Rank Fusion (RRF)
- Optional cross-encoder reranking
- Evidence-first RAG Playground
- Source/page inspection
- Adversarial query generation
- Failure diagnosis
- Repair candidates
- Automated configuration optimizer
- Paired before/after statistics
- Conservative self-improvement loop
- Optional grounded LLM generation
- Research benchmark and experiment artifacts
- FastAPI backend + Next.js dashboard

## Architecture

```text
Documents
   |
   v
Ingestion + page extraction
   |
   v
Chunking + metadata
   |
   +--------------------+
   |                    |
   v                    v
Lexical retrieval   Dense retrieval
   |                    |
   +---------+----------+
             v
       RRF / Hybrid
             |
             v
     Optional reranker
             |
             v
      Evidence set
             |
             v
  Local / optional LLM
             |
             v
 Answer + sources + scores
             |
             v
 Evaluation / attacks
             |
             v
 Diagnose -> repair -> compare
             |
             v
 Auto-optimizer / self-improvement
```

## Results

The included synthetic research benchmark contains **120 cases per configuration** across four retrieval configurations, for **480 evaluations**.

Current benchmark result from the optimizer:

| Configuration | Overall |
|---|---:|
| Hybrid@3 | **57.94** |
| TF-IDF@3 | 57.18 |
| Hybrid@5 | 53.89 |
| TF-IDF@5 | 53.87 |

The benchmark also showed that increasing `top_k` from 3 to 5 reduced the measured faithfulness proxy in this corpus. These are **benchmark-specific findings**, not universal claims.

## Run

### Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
pip install -r requirements-optional.txt
pytest
uvicorn app.main:app --reload --port 8000
```

### Frontend

Open another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open:

`http://localhost:3000`

### Optional production retrieval

Copy `.env.example` to `.env` and configure:

```text
PRODUCTION_RETRIEVAL=hybrid_dense
```

For optional LLM generation:

```text
RAG_PROVIDER=openai
OPENAI_API_KEY=...
RAG_MODEL=gpt-4o-mini
```

## Research commands

```powershell
cd backend
python -m app.research_benchmark
python -m app.auto_optimizer
```

## Important interpretation note

The project intentionally distinguishes **retrieval metrics**, **local grounding proxies**, and **LLM-based generation**. Proxy metrics should not be presented as human-validated truth. Benchmark winners should be described as winners on the included corpus/cases.

## Project structure

```text
backend/
  app/
    rag/
    evaluation/
    repair_engine.py
    auto_optimizer.py
    self_improvement.py
    research_stats.py
  tests/
  benchmark_results/

frontend/
  app/

docs/
  AUTO_OPTIMIZER.md
  PRODUCTION_RAG.md
  RESEARCH_METHODOLOGY.md
  REPAIR_ENGINE.md
  SELF_IMPROVEMENT.md

DECISIONS.md
.env.example
README.md
```
