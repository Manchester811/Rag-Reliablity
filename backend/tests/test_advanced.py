from app.evaluation.claims import analyze_claims
from app.rag.providers import HybridRetriever
from app.rag import chunking
from app.rag import __init__

class C:
    def __init__(self,id,text,source="test"): self.id=id; self.text=text; self.source=source

def test_claim_mapping():
    chunks=[(C("1","Revenue was 391 billion dollars.","report"),0.9)]
    result=analyze_claims("Revenue was 391 billion dollars.",chunks)
    assert result[0]["status"]=="supported"

def test_hybrid_retrieval():
    r=HybridRetriever([C("1","apple revenue 391 billion"),C("2","weather forecast")])
    got=r.retrieve("apple revenue",1)
    assert got[0][0].id=="1"

def test_chunking():
    assert chunking.fixed("one two three four five",2,0)==["one two","three four","five"]
