from app.rag.chunking import recursive
def test_recursive_chunking():
    chunks=recursive(" ".join(["evidence"]*100),size=20,overlap=5)
    assert len(chunks)>1
    assert all(x.strip() for x in chunks)
