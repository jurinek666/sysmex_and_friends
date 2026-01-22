from playwright.sync_api import sync_playwright

def verify_routes():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Base URL
        base_url = "http://localhost:10000"

        print(f"Checking {base_url}/clanky...")
        page.goto(f"{base_url}/clanky")
        page.screenshot(path="verification/clanky.png")
        print("Captured clanky.png")

        print(f"Checking {base_url}/vysledky...")
        page.goto(f"{base_url}/vysledky")
        page.screenshot(path="verification/vysledky.png")
        print("Captured vysledky.png")

        print(f"Checking {base_url}/tym...")
        page.goto(f"{base_url}/tym")
        page.screenshot(path="verification/tym.png")
        print("Captured tym.png")

        # Check homepage links
        print(f"Checking homepage links...")
        page.goto(f"{base_url}/")

        # Verify link to clanky
        clanky_link = page.get_by_role("link", name="Číst novinky")
        href = clanky_link.get_attribute("href")
        if href != "/clanky":
            print(f"ERROR: Expected link to /clanky, found {href}")
        else:
            print("Homepage link to /clanky verified")

        # Verify link to tym
        tym_link = page.get_by_role("link", name="Poznat tým")
        href = tym_link.get_attribute("href")
        if href != "/tym":
             print(f"ERROR: Expected link to /tym, found {href}")
        else:
             print("Homepage link to /tym verified")

        # Verify footer links
        footer_tym = page.locator("footer").get_by_role("link", name="Náš tým")
        if footer_tym.get_attribute("href") == "/tym":
            print("Footer link to /tym verified")
        else:
            print(f"ERROR: Footer link to /tym incorrect: {footer_tym.get_attribute('href')}")

        footer_clanky = page.locator("footer").get_by_role("link", name="Kronika")
        if footer_clanky.get_attribute("href") == "/clanky":
            print("Footer link to /clanky verified")
        else:
            print(f"ERROR: Footer link to /clanky incorrect: {footer_clanky.get_attribute('href')}")

        browser.close()

if __name__ == "__main__":
    verify_routes()
