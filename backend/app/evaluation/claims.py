import re
from .metrics import overlap

def extract_claims(answer):
    return [x.strip() for x in re.split(r"(?<=[.!?])\s+",answer) if x.strip()]

def analyze_claims(answer,chunks):
    claims=[]
    for claim in extract_claims(answer):
        matches=[]
        for c,score in chunks:
            support=overlap(claim,c.text)
            if support>=.18:
                matches.append({"chunk_id":c.id,"source":c.source,"support":round(support,4),"retrieval_score":round(score,4)})
        matches.sort(key=lambda x:x["support"],reverse=True)
        claims.append({"claim":claim,
                       "status":"supported" if matches and matches[0]["support"]>=.25 else ("partial" if matches else "unsupported"),
                       "evidence":matches[:3]})
    return claims
