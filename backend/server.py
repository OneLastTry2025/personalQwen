# Backend server for Qwen API - Direct copy adapted for supervisor
import asyncio
import os
import uuid
from pathlib import Path
from quart import Quart, request, jsonify, send_from_directory, current_app
from quart_cors import cors
from playwright.async_api import async_playwright, Browser, Page, Playwright
from playwright_stealth import Stealth
from utils import save_error_state, QWEN_URL, STATE_FILE

# --- Browser and Page Management ---
class BrowserManager:
    """Manages a persistent browser instance and a pool of pages for concurrent requests."""
    def __init__(self, pool_size=3):
        self.playwright: Playwright = None
        self.browser: Browser = None
        self.page_pool: asyncio.Queue = None
        self.pool_size = pool_size

    async def initialize(self):
        print("[*] Initializing browser manager...")
        if not STATE_FILE.exists():
            raise FileNotFoundError(
                f"Authentication file not found at '{STATE_FILE}'. "
                "Please run `receive_auth_state.py` and use the extension to save your session."
            )
        
        self.playwright = await async_playwright().start()
        print("[*] Launching persistent browser (this may take a moment)...")
        self.browser = await self.playwright.chromium.launch(headless=True)
        
        context = await self.browser.new_context(storage_state=str(STATE_FILE))
        
        print("[*] Applying stealth to browser context...")
        await Stealth().apply_stealth_async(context)
        
        self.page_pool = asyncio.Queue(maxsize=self.pool_size)
        for i in range(self.pool_size):
            print(f"[*] Creating page {i+1}/{self.pool_size} for the pool...")
            page = await context.new_page()
            await page.goto(QWEN_URL, wait_until="domcontentloaded")
            await self.page_pool.put(page)
        print(f"[+] Browser and a pool of {self.pool_size} pages initialized successfully.")

    async def get_page(self) -> Page:
        print("[*] Acquiring a page from the pool...")
        page = await self.page_pool.get()
        print("[+] Page acquired.")
        return page

    def release_page(self, page: Page):
        print("[*] Releasing page back to the pool...")
        self.page_pool.put_nowait(page)
        print("[+] Page released.")

    async def shutdown(self):
        print("[*] Shutting down browser manager...")
        if self.browser:
            await self.browser.close()
        if self.playwright:
            await self.playwright.stop()
        print("[+] Shutdown complete.")

# --- Global Browser Manager Instance ---
browser_manager = BrowserManager(pool_size=3)

# --- Quart App ---
app = Quart(__name__)
app = cors(app, allow_origin="*")

@app.before_serving
async def startup():
    await browser_manager.initialize()

@app.after_serving
async def shutdown():
    await browser_manager.shutdown()

# --- Frontend Serving ---
@app.route('/')
async def serve_index():
    # Serve the index.html from the ui_clone subfolder
    return await send_from_directory('ui_clone', 'index.html')

@app.route('/assets/<path:filename>')
async def serve_assets(filename):
    """Serves static files from the ui_clone/assets directory."""
    return await send_from_directory(Path('ui_clone') / 'assets', filename)

# Basic test endpoint
@app.route('/test')
async def test():
    return jsonify({"status": "success", "message": "Backend is running!"})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8001)