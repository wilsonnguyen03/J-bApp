from playwright.async_api import async_playwright

async def scrape_url(url: str) -> str:
    """
    Launches a headless browser, navigates to the URL,
    and returns the page's text content.
    """
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        page = await context.new_page()

        try:
            await page.goto(url, wait_until="domcontentloaded", timeout=20000)
            await page.wait_for_timeout(2000)  # let JS render
            text = await page.inner_text("body")
            return text[:15000]  # cap at 15k chars to stay within Claude's context
        except Exception as e:
            raise Exception(f"Failed to scrape {url}: {str(e)}")
        finally:
            await browser.close()