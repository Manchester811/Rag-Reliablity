from .metrics import evaluate
from .judge import judge
from .claims import analyze_claims

def evaluate_full(question,expected,answer,retrieved,judge_provider=None):
    metrics=evaluate(question,expected,answer,retrieved)
    evidence=" ".join(c.text for c,_ in retrieved)
    jr=judge(answer,evidence,expected,judge_provider)
    claims=analyze_claims(answer,retrieved)
    supported=sum(x["status"]=="supported" for x in claims)
    metrics["llm_judge_score"]=jr.score
    metrics["llm_judge_provider"]=jr.provider
    metrics["claim_support_rate"]=round(supported/max(1,len(claims)),4)
    metrics["claims"]=claims
    metrics["overall"]=round((metrics["overall"]*.75)+(jr.score*100*.15)+(metrics["claim_support_rate"]*100*.10),2)
    return metrics
