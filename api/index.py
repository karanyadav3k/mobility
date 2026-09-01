import os
import sys

root_path = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if root_path not in sys.path:
    sys.path.insert(0, root_path)

from mangum import Mangum
from main import app

class VercelPathFixMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] in ("http", "websocket"):
            headers = dict(scope.get("headers", []))
            matched_path = headers.get(b"x-matched-path", b"").decode("utf-8")
            if matched_path:
                scope["path"] = matched_path
            elif scope.get("path", "").startswith("/api/index"):
                scope["path"] = "/"
        await self.app(scope, receive, send)

wrapped_app = VercelPathFixMiddleware(app)
handler = Mangum(wrapped_app, lifespan="off")
