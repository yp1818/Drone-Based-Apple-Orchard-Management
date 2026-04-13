import os
from fastapi import UploadFile

UPLOAD_DIR = "static/uploads"

def save_file(file: UploadFile):
    #  Fix: if uploads exists but is a FILE → delete it
    if os.path.exists(UPLOAD_DIR) and not os.path.isdir(UPLOAD_DIR):
        os.remove(UPLOAD_DIR)

    # Create folder safely
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    # Optional: avoid filename conflicts
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as f:
        f.write(file.file.read())

    return file_path