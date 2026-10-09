from app.research_stats import paired_stats
def test_paired_stats():
    x=paired_stats([50,50,50],[55,52,53])
    assert x["n"]==3
    assert x["improved_cases"]==3
    assert x["mean_delta"]>0
