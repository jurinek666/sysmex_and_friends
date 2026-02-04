from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # iPhone 14 viewport
        context = browser.new_context(viewport={"width": 390, "height": 844}, user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1")
        page = context.new_page()

        print("Navigating to Homepage...")
        page.goto("http://localhost:3000")

        # 1. Homepage Screenshot
        page.wait_for_selector("main")
        page.screenshot(path="verification/homepage_mobile.png", full_page=True)
        print("Homepage screenshot taken.")

        # 2. Navbar Menu Open Screenshot
        # Click the hamburger menu (aria-label="Otevřít menu")
        # Locator: button[aria-label="Otevřít menu"]
        print("Opening menu...")
        menu_btn = page.locator('button[aria-label="Otevřít menu"]')
        if menu_btn.is_visible():
            menu_btn.click()
            page.wait_for_timeout(500) # Wait for animation
            page.screenshot(path="verification/mobile_menu_open.png")
            print("Menu screenshot taken.")
        else:
            print("Menu button not visible!")

        # 3. Vysledky Screenshot
        print("Navigating to Vysledky...")
        page.goto("http://localhost:3000/vysledky")
        page.wait_for_selector("main")
        page.screenshot(path="verification/vysledky_mobile.png", full_page=True)
        print("Vysledky screenshot taken.")

        # 4. Tym Screenshot (MemberCard compact check - wait, Tym uses Full variant)
        # On homepage, the Team card uses Compact variant.
        # But let's check the /tym page too.
        print("Navigating to Tym...")
        page.goto("http://localhost:3000/tym")
        page.wait_for_selector("main")
        page.screenshot(path="verification/tym_mobile.png", full_page=True)
        print("Tym screenshot taken.")

        browser.close()

if __name__ == "__main__":
    run()
