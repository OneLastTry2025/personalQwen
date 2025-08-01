# Simplified backend server for preview - without browser automation for now
import asyncio
import os
from pathlib import Path
from quart import Quart, request, jsonify, send_from_directory
from quart_cors import cors

# --- Quart App ---
app = Quart(__name__)
app = cors(app, allow_origin="*")

# --- Frontend Serving ---
@app.route('/')
async def serve_index():
    # Serve the index.html from the ui_clone subfolder
    return await send_from_directory('ui_clone', 'index.html')

@app.route('/assets/<path:filename>')
async def serve_assets(filename):
    """Serves static files from the ui_clone/assets directory."""
    return await send_from_directory(Path('ui_clone') / 'assets', filename)

# Mock endpoints for preview
@app.route('/test')
async def test():
    return jsonify({"status": "success", "message": "Backend is running!"})

@app.route('/model', methods=['GET'])
async def model():
    return jsonify({"status": "success", "model_name": "Qwen3-235B-A22B-2507"})

@app.route('/chat', methods=['POST'])
async def chat():
    data = await request.get_json() or {}
    prompt = data.get('prompt', 'Hello')
    return jsonify({
        "status": "success", 
        "response": f"Mock response to: {prompt}",
        "chat_id": "mock-chat-id"
    })

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8001)