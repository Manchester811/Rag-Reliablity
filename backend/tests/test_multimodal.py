import pytest
from app.ingestion.multimodal import ocr_image, extract_tables, embed_image

def test_ocr_stub():
    assert ocr_image is not None

def test_table_stub():
    assert extract_tables is not None

def test_embed_stub():
    v = embed_image(None)
    assert len(v) == 512



def test_db_init_at_temp_path():
    import os, tempfile
    from pathlib import Path
    tmp = Path(tempfile.gettempdir()) / "rag_reliability_test_db"
    tmp.mkdir(exist_ok=True)
    db_file = tmp / "test.db"
    os.environ["DB_PATH"] = str(db_file)
    # Force config reload by importing fresh module after env set
    from app.db import init_db, connect
    init_db()
    with connect() as c:
        c.execute("INSERT INTO experiments (name, config_json, status, created_at) VALUES (?, ?, ?, ?)",
                  ("temp-test", "{}", "running", "2026-01-01"))
        c.commit()
    assert db_file.exists()
    assert db_file.stat().st_size > 0
