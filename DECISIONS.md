# Technical Decisions

## 1. Hybrid retrieval + RRF
**Decision:** combine lexical and optional dense retrieval with Reciprocal Rank Fusion.

**Why:** lexical retrieval is transparent and fast, while dense retrieval improves semantic matching. RRF avoids forcing both systems onto the same score scale.

**Trade-off:** two retrieval paths increase complexity and dense embeddings add model-download/compute cost.

## 2. Evidence-first answers
**Decision:** every answer is returned with retrieved chunks and page metadata.

**Why:** reliability is the core project goal. Users should be able to inspect the evidence rather than trust an opaque answer.

**Trade-off:** responses and UI are more verbose, and citation evaluation is harder than plain answer scoring.

## 3. Conservative self-improvement
**Decision:** a repair is accepted only when its measured benchmark score improves over the baseline.

**Why:** prevents "optimization" from becoming an unverified configuration change.

**Trade-off:** the decision is benchmark-specific and may reject a useful change when the evaluation corpus is too small or narrow.
