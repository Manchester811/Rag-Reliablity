# Retrieval merge: text + image embeddings via RRF
# Uses existing RRF; add image_embedding to dense retrieval index.
# Stub — integrate with backend/app/rag/

def merge_retrieval(text_results, image_results, rrf_k=60):
    # Combine text and image retrieval results using RRF-like fusion
    # text_results / image_results: list of dict with chunk_id, score
    scores = {}
    for r in text_results + image_results:
        cid = r.get("chunk_id") or r.get("id")
        s = r.get("score", 0)
        scores[cid] = scores.get(cid, 0) + s
    ranked = sorted(scores.items(), key=lambda x: -x[1])
    return [{"chunk_id": cid, "score": s, "source": "multimodal"} for cid, s in ranked]
