import os
import sys
import asyncio
import io

# Ensure project root is in sys.path
path = os.path.dirname(os.path.abspath(__file__))
if path not in sys.path:
    sys.path.insert(0, path)

from main import app

class SyncASGItoWSGI:
    """
    Ultra-fast single-threaded synchronous ASGI-to-WSGI bridge.
    Executes entirely in the main thread with zero threading deadlocks on PythonAnywhere.
    """
    def __init__(self, asgi_app):
        self.asgi_app = asgi_app

    def __call__(self, environ, start_response):
        path_info = environ.get("PATH_INFO", "")
        method = environ.get("REQUEST_METHOD", "GET")
        query_string = environ.get("QUERY_STRING", "").encode("utf-8")
        
        try:
            content_length = int(environ.get("CONTENT_LENGTH", 0) or 0)
        except (ValueError, TypeError):
            content_length = 0
            
        body = environ.get("wsgi.input").read(content_length) if content_length > 0 else b""

        headers = []
        for k, v in environ.items():
            if k.startswith("HTTP_"):
                header_name = k[5:].replace("_", "-").lower().encode("latin1")
                headers.append((header_name, v.encode("latin1")))
            elif k in ("CONTENT_TYPE", "CONTENT_LENGTH"):
                headers.append((k.replace("_", "-").lower().encode("latin1"), v.encode("latin1")))

        scope = {
            "type": "http",
            "asgi": {"version": "3.0"},
            "http_version": "1.1",
            "method": method,
            "path": path_info,
            "raw_path": path_info.encode("latin1"),
            "query_string": query_string,
            "headers": headers,
            "server": (environ.get("SERVER_NAME", "localhost"), int(environ.get("SERVER_PORT", 80))),
        }

        response_status = 200
        response_headers = []
        response_body = io.BytesIO()

        async def receive():
            return {"type": "http.request", "body": body, "more_body": False}

        async def send(message):
            nonlocal response_status, response_headers
            if message["type"] == "http.response.start":
                response_status = message["status"]
                response_headers = [(k.decode("latin1"), v.decode("latin1")) for k, v in message.get("headers", [])]
            elif message["type"] == "http.response.body":
                response_body.write(message.get("body", b""))

        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            loop.run_until_complete(self.asgi_app(scope, receive, send))
        finally:
            loop.close()

        status_text = f"{response_status} OK" if response_status == 200 else f"{response_status} Status"
        start_response(status_text, response_headers)
        return [response_body.getvalue()]

# Export standard WSGI application for PythonAnywhere
application = SyncASGItoWSGI(app)
