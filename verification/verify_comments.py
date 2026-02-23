from playwright.sync_api import sync_playwright
import time

def verify_comments(page):
    # 1. Articles
    print("Navigating to /")
    page.goto("http://localhost:3000")
    # Wait for articles to load
    page.wait_for_selector("a[href^='/clanky/']", timeout=10000)

    # Click first article
    print("Clicking first article")
    page.locator("a[href^='/clanky/']").first.click()

    # Wait for comments section
    print("Waiting for comments")
    page.wait_for_selector("text=Komentáře", timeout=10000)

    # Screenshot
    print("Taking screenshot 1")
    page.screenshot(path="verification/clanky-comments.png", full_page=True)

    # 2. Gallery
    print("Navigating to /galerie")
    page.goto("http://localhost:3000/galerie")

    # Check if there are albums
    # Look for links starting with /galerie/ (but not /galerie itself)
    # The gallery page has /galerie in href?
    # Usually album links are /galerie/some-id
    try:
        page.wait_for_selector("a[href^='/galerie/']", timeout=5000)
        print("Found album link")
        page.locator("a[href^='/galerie/']").first.click()

        # Wait for comments section
        print("Waiting for comments in gallery")
        page.wait_for_selector("text=Komentáře", timeout=10000)

        # Screenshot
        print("Taking screenshot 2")
        page.screenshot(path="verification/galerie-comments.png", full_page=True)
    except:
        print("No albums found or timeout, checking content")
        page.screenshot(path="verification/galerie-empty.png", full_page=True)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_comments(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()
