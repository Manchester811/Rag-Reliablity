def test_optimizer_config_count():
    from app.auto_optimizer import CONFIGS
    assert len(CONFIGS)==4
    assert {x["name"] for x in CONFIGS}=={"TF-IDF@3","TF-IDF@5","Hybrid@3","Hybrid@5"}
