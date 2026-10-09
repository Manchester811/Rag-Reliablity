from fastapi.testclient import TestClient
from app.main import app
client=TestClient(app)

def test_health():
    r=client.get("/api/health")
    assert r.status_code==200
    assert r.json()["status"]=="ok"

def test_attacks():
    r=client.post("/api/attacks/generate",json={
        "question":"What was revenue?","expected_answer":"100",
        "attack_types":["paraphrase","typo"]})
    assert r.status_code==200
    assert len(r.json())==2
