import os
import sys

root_path = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if root_path not in sys.path:
    sys.path.insert(0, root_path)

from mangum import Mangum

try:
    from main import app
    handler = Mangum(app, lifespan="off")
except Exception as e:
    import traceback
    from fastapi import FastAPI
    from fastapi.responses import HTMLResponse
    err_app = FastAPI()
    err_tb = traceback.format_exc()

    @err_app.get("/", response_class=HTMLResponse)
    @err_app.get("/{full_path:path}", response_class=HTMLResponse)
    def catch_all(full_path: str = ""):
        return HTMLResponse(content=f"<h3>Startup Exception:</h3><pre style='color:red;'>{err_tb}</pre>")

    handler = Mangum(err_app, lifespan="off")
