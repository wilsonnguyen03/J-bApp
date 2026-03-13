import json
import os
from playwright.async_api import async_playwright

async def scrape_url(url: str) -> str:
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context_options = {
            "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }

        # Load cookies if they exist
        cookies_path = os.path.join(os.path.dirname(__file__), "cookies.json")
        context = await browser.new_context(**context_options)

        if os.path.exists(cookies_path):
            with open(cookies_path, "r") as f:
                cookies = json.load(f)
            await context.add_cookies(cookies)

        page = await context.new_page()

        try:
            await page.goto(url, wait_until="domcontentloaded", timeout=30000)
            await page.wait_for_timeout(3000)
            text = await page.inner_text("body")
            return text[:15000]
        except Exception as e:
            raise Exception(f"Failed to scrape {url}: {str(e)}")
        finally:
            await browser.close()

