"""Pluggable retrieval/generation providers.

The local provider remains the default. Optional providers are intentionally
lazy-loaded so the project works without heavyweight model downloads.
"""
from dataclasses import dataclass
from typing import Protocol

class Retriever(Protocol):
    def retrieve(self, query: str, top_k: int): ...

class Generator(Protocol):
    def generate(self, question: str, contexts: list[str]) -> str: ...

@dataclass
class RetrievalResult:
    chunk_id: str
    text: str
    source: str
    score: float

class HybridRetriever:
    """Lightweight hybrid retriever: lexical TF-IDF + token overlap.

    This is a dependency-light hybrid baseline; dense retrieval can be enabled
    through DenseRetriever when sentence-transformers is installed.
    """
    def __init__(self, chunks):
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.metrics.pairwise import cosine_similarity
        import re
        self.chunks=chunks
        self.vectorizer=TfidfVectorizer(stop_words="english")
        self.matrix=self.vectorizer.fit_transform([c.text for c in chunks])
        self.cosine_similarity=cosine_similarity
        self.re=re

    def retrieve(self, query, top_k=5):
        q=self.vectorizer.transform([query])
        dense_like=self.cosine_similarity(q,self.matrix)[0]
        qtokens=set(self.re.findall(r"[a-z0-9]+",query.lower()))
        scored=[]
        for i,c in enumerate(self.chunks):
            ct=set(self.re.findall(r"[a-z0-9]+",c.text.lower()))
            lexical=len(qtokens & ct)/max(1,len(qtokens))
            score=.65*float(dense_like[i])+.35*lexical
            scored.append((c,score))
        return sorted(scored,key=lambda x:x[1],reverse=True)[:top_k]

class DenseRetriever:
    """Optional sentence-transformers cosine retrieval."""
    def __init__(self,chunks,model_name="all-MiniLM-L6-v2"):
        from sentence_transformers import SentenceTransformer
        import numpy as np
        self.chunks=chunks
        self.model=SentenceTransformer(model_name)
        self.embeddings=self.model.encode([c.text for c in chunks],normalize_embeddings=True)
        self.np=np
    def retrieve(self,query,top_k=5):
        q=self.model.encode([query],normalize_embeddings=True)[0]
        scores=self.embeddings @ q
        idx=self.np.argsort(scores)[::-1][:top_k]
        return [(self.chunks[int(i)],float(scores[int(i)])) for i in idx]

class OpenAIGenerator:
    def __init__(self,model="gpt-4o-mini"):
        from openai import OpenAI
        self.client=OpenAI()
        self.model=model
    def generate(self,question,contexts):
        prompt=("Answer only from the supplied evidence. If evidence is insufficient, say so. "
                "Cite evidence using [source].\n\nQuestion: "+question+
                "\n\nEvidence:\n"+"\n".join(contexts))
        r=self.client.responses.create(model=self.model,input=prompt)
        return r.output_text
