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
            raw_matched = headers.get(b"x-matched-path", b"")
            if raw_matched:
                matched_path = raw_matched.decode("utf-8")
                if "?" in matched_path:
                    matched_path = matched_path.split("?", 1)[0]
                scope["path"] = matched_path
                scope["raw_path"] = matched_path.encode("utf-8")
            elif scope.get("path", "") in ("/api/index.py", "/api/index"):
                scope["path"] = "/"
        await self.app(scope, receive, send)

handler = Mangum(VercelPathFixMiddleware(app), lifespan="off")
