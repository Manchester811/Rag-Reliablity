import os

class CrossEncoderReranker:
    """Optional cross-encoder reranker. Falls back cleanly if unavailable."""
    def __init__(self, model_name=None):
        from sentence_transformers import CrossEncoder
        self.model=CrossEncoder(model_name or os.getenv(
            "RERANK_MODEL","cross-encoder/ms-marco-MiniLM-L-6-v2"))

    def rerank(self, query, candidates, top_k=5):
        pairs=[(query,c.text) for c,_ in candidates]
        scores=self.model.predict(pairs)
        ranked=sorted(zip(candidates,scores),key=lambda x:float(x[1]),reverse=True)
        return [(item[0],float(score)) for item,score in ranked[:top_k]]

class OpenAIAnswerGenerator:
    def __init__(self, model=None):
        from openai import OpenAI
        self.client=OpenAI()
        self.model=model or os.getenv("RAG_MODEL","gpt-4o-mini")

    def generate(self, question, sources):
        evidence="\n\n".join(
            f"[Source {i+1} | Page {s.get('page') or 'N/A'}]\n{s['text']}"
            for i,s in enumerate(sources)
        )
        prompt=f"""You are a grounded RAG assistant.
Answer the question ONLY using the evidence below.
If the evidence is insufficient, say so.
Cite every factual claim using [Source N].
Do not invent citations.

Question:
{question}

Evidence:
{evidence}
"""
        response=self.client.responses.create(model=self.model,input=prompt)
        return response.output_text

def generation_mode():
    return "openai" if os.getenv("RAG_PROVIDER","local").lower()=="openai" and os.getenv("OPENAI_API_KEY") else "local"
