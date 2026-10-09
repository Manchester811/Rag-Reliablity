import os, json

class JudgeResult:
    def __init__(self,score,reason,provider):
        self.score=round(float(score),4); self.reason=reason; self.provider=provider
    def as_dict(self): return {"score":self.score,"reason":self.reason,"provider":self.provider}

def lexical_fallback(answer,evidence,expected):
    from .metrics import overlap
    faith=overlap(answer,evidence); rel=overlap(answer,expected)
    return JudgeResult((faith+rel)/2,"Deterministic lexical fallback; not an LLM judgment.","lexical-proxy")

def judge(answer,evidence,expected,provider=None):
    provider=provider or os.getenv("EVAL_PROVIDER","local")
    if provider=="openai" and os.getenv("OPENAI_API_KEY"):
        try:
            from openai import OpenAI
            client=OpenAI()
            prompt=f"""Evaluate a RAG answer. Return JSON only with score from 0 to 1 and reason.
Expected answer: {expected}
Evidence: {evidence}
Answer: {answer}
Score faithfulness and relevance together."""
            r=client.responses.create(model=os.getenv("EVAL_MODEL","gpt-4o-mini"),input=prompt)
            data=json.loads(r.output_text)
            return JudgeResult(data["score"],data.get("reason",""),"openai")
        except Exception as exc:
            return JudgeResult(0.0,f"LLM judge failed safely: {exc}","openai-error")
    return lexical_fallback(answer,evidence,expected)
