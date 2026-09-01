import os
import sys

root_path = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if root_path not in sys.path:
    sys.path.insert(0, root_path)

from mangum import Mangum
from main import app

handler = Mangum(app, lifespan="off")
