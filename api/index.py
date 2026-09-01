import os
import sys

root_path = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if root_path not in sys.path:
    sys.path.insert(0, root_path)

from mangum import Mangum
from main import app

class VercelScopeRouter:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] in ("http", "websocket"):
            p = scope.get("path", "")
            if p in ("/api/index.py", "/api/index", "/api", ""):
                scope["path"] = "/"
            elif p.startswith("/api/index.py/"):
                scope["path"] = p[len("/api/index.py"):]
            elif p.startswith("/api/index/"):
                scope["path"] = p[len("/api/index"):]
            elif p.startswith("/api/"):
                # keep original API path
                pass
        await self.app(scope, receive, send)

handler = Mangum(VercelScopeRouter(app), lifespan="off")
