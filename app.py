# Entrypoint for 24/7 Hugging Face Gradio Cloud Hosting
import os
import uvicorn
from main import app

if __name__ == "__main__":
    port = int(os.getenv("PORT", 7860))
    print(f"[*] Starting GatiConnect 24/7 Mobility Cloud Server on port {port}...")
    uvicorn.run("main:app", host="0.0.0.0", port=port)
