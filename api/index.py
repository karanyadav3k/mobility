import os
import sys
import traceback

# Add project root to sys.path
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

try:
    from main import app
except Exception as e:
    err_str = traceback.format_exc()
    from fastapi import FastAPI
    from fastapi.responses import HTMLResponse
    app = FastAPI()
    @app.get("/{rest_of_path:path}")
    def error_handler(rest_of_path: str = ""):
        return HTMLResponse(content=f"<h2>Startup Error on Vercel</h2><pre style='color:red; background:#f8fafc; padding:1rem; border:1px solid #cbd5e1;'>{err_str}</pre>")
