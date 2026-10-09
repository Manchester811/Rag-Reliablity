from app.evaluation.metrics import recall_at_k, reciprocal_rank, ndcg_at_k
def test_recall():
    assert recall_at_k({"a"},["a","b"],2)==1
def test_mrr():
    assert reciprocal_rank({"b"},["a","b"])==0.5
def test_ndcg():
    assert ndcg_at_k({"a"},["a"],1)==1
