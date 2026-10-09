from dataclasses import dataclass
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

@dataclass
class Chunk:
    id: str
    text: str
    source: str

class DemoRAG:
    """Offline deterministic RAG used by the benchmark."""
    def __init__(self, chunks):
        self.chunks=chunks
        self.vectorizer=TfidfVectorizer(stop_words="english")
        self.matrix=self.vectorizer.fit_transform([c.text for c in chunks])

    def retrieve(self, question, top_k=3):
        q=self.vectorizer.transform([question])
        scores=cosine_similarity(q,self.matrix)[0]
        ranked=sorted(zip(self.chunks,scores),key=lambda x:float(x[1]),reverse=True)
        return [(c,float(s)) for c,s in ranked[:top_k]]

    def answer(self, question, top_k=3):
        retrieved=self.retrieve(question,top_k)
        answer="I could not find enough evidence in the retrieved context."
        for c,_ in retrieved:
            if ":" in c.text:
                answer=c.text.split(":",1)[1].strip()
                break
        return answer,retrieved
