import os
import sys

# Ensure project directory is in sys.path
path = os.path.dirname(os.path.abspath(__file__))
if path not in sys.path:
    sys.path.insert(0, path)

from main import app
from a2wsgi import ASGIMiddleware

# Standard WSGI entrypoint for PythonAnywhere
application = ASGIMiddleware(app)
