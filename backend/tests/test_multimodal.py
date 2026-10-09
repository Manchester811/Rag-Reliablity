import pytest
from backend.app.ingestion.multimodal import ocr_image, extract_tables, embed_image

def test_ocr_stub():
    assert ocr_image is not None

def test_table_stub():
    assert extract_tables is not None

def test_embed_stub():
    v = embed_image(None)
    assert len(v) == 512
