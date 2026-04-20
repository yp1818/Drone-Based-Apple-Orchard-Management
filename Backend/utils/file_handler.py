import os
from fastapi import UploadFile

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOAD_DIR = os.path.join(BASE_DIR, "static", "uploads")

def save_file(file: UploadFile):
    if os.path.exists(UPLOAD_DIR) and not os.path.isdir(UPLOAD_DIR):
        os.remove(UPLOAD_DIR)

    os.makedirs(UPLOAD_DIR, exist_ok=True)

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as f:
        f.write(file.file.read())

    # convert to relative path
    relative_path = f"static/uploads/{file.filename}"

    return relative_path