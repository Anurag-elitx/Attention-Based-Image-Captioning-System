import io
from fastapi.testclient import TestClient

def test_caption_unauthorized(client: TestClient):
    response = client.post("/api/v1/caption/")
    assert response.status_code == 401

def test_caption_invalid_file(client: TestClient, auth_token: str):
    file_content = b"This is a text file, not an image."
    files = {"file": ("test.txt", io.BytesIO(file_content), "text/plain")}
    response = client.post(
        "/api/v1/caption/",
        headers={"Authorization": f"Bearer {auth_token}"},
        files=files
    )
    assert response.status_code == 400
    assert "not an image" in response.json()["detail"]

def test_caption_valid_upload(client: TestClient, auth_token: str):
    # Create a dummy valid image in memory
    from PIL import Image
    image = Image.new('RGB', (224, 224), color = 'red')
    img_byte_arr = io.BytesIO()
    image.save(img_byte_arr, format='JPEG')
    img_byte_arr.seek(0)
    
    files = {"file": ("test.jpg", img_byte_arr, "image/jpeg")}
    response = client.post(
        "/api/v1/caption/",
        headers={"Authorization": f"Bearer {auth_token}"},
        files=files
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "caption_text" in data
    assert "confidence" in data
