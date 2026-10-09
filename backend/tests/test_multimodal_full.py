import pytest, os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "backend"))

from app.ingestion.multimodal import ocr_image, extract_tables, embed_image, __all__

def test_multimodal_imports():
    assert "ocr_image" in __all__
    assert "extract_tables" in __all__
    assert "embed_image" in __all__

def test_ocr_error_handling():
    res = ocr_image("nonexistent_file_12345.png")
    assert res["status"] == "error"
    assert ("FileNotFoundError" in res.get("error", "") or "not found" in res.get("error", ""))

def test_table_fallback():
    # Should not crash; returns list regardless
    res = extract_tables("nonexistent.pdf")
    assert isinstance(res, list)

def test_embed_returns_list():
    res = embed_image(None)
    assert isinstance(res, list)
    assert len(res) > 0

def test_merge_retrieval():
    from app.rag.multimodal_merge import merge_retrieval
    r = merge_retrieval([{"chunk_id":"a","score":0.9}], [{"chunk_id":"b","score":0.7}])
    assert len(r) == 2
