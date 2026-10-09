import os, math
from collections import defaultdict

class DenseRetriever:
    def __init__(self, chunks, model_name=None):
        from sentence_transformers import SentenceTransformer
        self.chunks=chunks
        self.model=SentenceTransformer(model_name or os.getenv("EMBEDDING_MODEL","all-MiniLM-L6-v2"))
        self.embeddings=self.model.encode([c.text for c in chunks],normalize_embeddings=True)

    def retrieve(self, query, top_k=5):
        q=self.model.encode([query],normalize_embeddings=True)[0]
        scores=[float(sum(a*b for a,b in zip(q,e))) for e in self.embeddings]
        idx=sorted(range(len(scores)),key=lambda i:scores[i],reverse=True)[:top_k]
        return [(self.chunks[i],scores[i]) for i in idx]

def reciprocal_rank_fusion(result_lists, top_k=5, k=60):
    scores=defaultdict(float); items={}
    for results in result_lists:
        for rank,(chunk,_) in enumerate(results,1):
            key=chunk.id
            items[key]=chunk
            scores[key]+=1/(k+rank)
    ranked=sorted(items.values(),key=lambda c:scores[c.id],reverse=True)[:top_k]
    return [(c,scores[c.id]) for c in ranked]

def hybrid_dense_lexical(chunks, query, top_k=5):
    """Use dense + lexical RRF when optional sentence-transformers is available."""
    from .providers import HybridRetriever
    lexical=HybridRetriever(chunks).retrieve(query,max(top_k,8))
    dense=DenseRetriever(chunks).retrieve(query,max(top_k,8))
    return reciprocal_rank_fusion([lexical,dense],top_k=top_k)
