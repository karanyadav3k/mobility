import os
import sys

root_path = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if root_path not in sys.path:
    sys.path.insert(0, root_path)

from mangum import Mangum
from main import app

class ApiPrefixMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] in ("http", "websocket"):
            p = scope.get("path", "")
            if not p.startswith("/api"):
                scope["path"] = f"/api{p if p.startswith('/') else '/' + p}"
                scope["raw_path"] = scope["path"].encode("utf-8")
        await self.app(scope, receive, send)

handler = Mangum(ApiPrefixMiddleware(app), lifespan="off")
