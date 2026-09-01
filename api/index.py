import os
import sys

root_path = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if root_path not in sys.path:
    sys.path.insert(0, root_path)

from fastapi import FastAPI
from fastapi.responses import HTMLResponse

app = FastAPI(title="GatiConnect Mobility Platform")

try:
    from main import app as main_app
    app = main_app
except Exception as e:
    import traceback
    err_tb = traceback.format_exc()
    @app.get("/{full_path:path}", response_class=HTMLResponse)
    def catch_all_error(full_path: str = ""):
        return HTMLResponse(content=f"<h3>Vercel Startup Exception:</h3><pre style='color:red;'>{err_tb}</pre>")
