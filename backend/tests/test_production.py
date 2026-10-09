def test_rrf():
    from app.rag.production import reciprocal_rank_fusion
    from app.rag import Chunk
    a=Chunk("a","alpha","d"); b=Chunk("b","beta","d")
    out=reciprocal_rank_fusion([[(a,1),(b,.5)],[(a,.7),(b,.4)]],2)
    assert out[0][0].id=="a"
