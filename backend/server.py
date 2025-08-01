# Backend wrapper for the Qwen API server
import os
import sys

# Add the parent directory to the Python path to import api_server
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from api_server import app

if __name__ == "__main__":
    # This will be run by uvicorn, so we just need to expose the app
    pass