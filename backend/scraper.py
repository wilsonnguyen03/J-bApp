import json
import os
import threading
import asyncio
from playwright.sync_api import sync_playwright

def _scrape_sync(url: str, cookies: list) -> str:
    """
    Uses the synchronous Playwright API which works reliably on Windows.
    Runs in a separate thread to avoid blocking FastAPI.
    """
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )

        if cookies:
            context.add_cookies(cookies)

        page = context.new_page()

        try:
            page.goto(url, wait_until="domcontentloaded", timeout=30000)
            page.wait_for_timeout(3000)
            text = page.inner_text("body")
            return text[:15000]
        except Exception as e:
            raise Exception(f"Failed to scrape {url}: {str(e)}")
        finally:
            browser.close()


async def scrape_url(url: str) -> str:
    # Load and sanitise cookies if they exist
    cookies = []
    cookies_path = os.path.join(os.path.dirname(__file__), "cookies.json")
    if os.path.exists(cookies_path):
        with open(cookies_path, "r") as f:
            raw_cookies = json.load(f)
        
        # Playwright only accepts Strict, Lax, or None for sameSite
        valid_same_site = {"Strict", "Lax", "None"}
        for cookie in raw_cookies:
            if "sameSite" in cookie:
                if cookie["sameSite"] not in valid_same_site:
                    cookie["sameSite"] = "None"
            cookies.append(cookie)

    # Run the sync scraper in a separate thread
    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(
        None,
        lambda: _scrape_sync(url, cookies)
    )
    return result