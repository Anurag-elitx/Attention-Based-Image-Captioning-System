from fastapi.testclient import TestClient

def test_health(client: TestClient):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert "encoder_name" in data
    assert data["encoder_name"] == "ResNet-101"
    
def test_gpu_health(client: TestClient):
    response = client.get("/api/v1/health/gpu")
    assert response.status_code == 200
    data = response.json()
    assert "cuda_available" in data
