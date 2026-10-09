from app.repair_engine import diagnose, compare
def test_diagnose_grounding():
    x=diagnose({"faithfulness_proxy":0.3,"retrieval_recall":0.8})
    assert x["failure"]=="grounding"
def test_compare_improvement():
    assert compare({"overall":50},{"overall":55})["improved"] is True
