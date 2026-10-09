from app.self_improvement import choose_repair
def test_repair_selection():
    assert choose_repair({"failure":"grounding"})=="Top-K 3"
    assert choose_repair({"failure":"retrieval"})=="Hybrid@3"
    assert choose_repair({"failure":"none"}) is None
