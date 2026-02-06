# Plán transformace na Docker a Google Cloud

Tento dokument popisuje detailní plán a postup transformace aplikace `sysmex-friends` (Next.js) do kontejnerizované podoby pomocí Dockeru, včetně přípravy pro nasazení na Google Cloud Platform (GCP).

## 1. Analýza proveditelnosti

**Závěr:** Transformace je **plně proveditelná**.
Aplikace využívá standardní stack (Next.js 16), který má vestavěnou podporu pro tvorbu optimalizovaných Docker images pomocí módu `output: "standalone"`. Externí služby (Supabase, Cloudinary) zůstanou oddělené a budou se do kontejneru napojovat pomocí environment proměnných, což je doporučená "cloud-native" architektura.

---

## 2. Co je potřeba nachystat (Prerequisites checklist)

Než začneme psát kód, je potřeba zajistit následující prerekvizity na straně Google Cloud a GitHubu:

### Google Cloud Platform (GCP)
1.  **GCP Projekt:** Musíte mít vytvořený projekt v Google Cloud (znát `PROJECT_ID`).
2.  **Artifact Registry:**
    - Vytvořit repozitář pro Docker images (typ "Docker").
    - Příklad názvu: `sysmex-repo`.
    - Region: např. `europe-west1` (podle preference).
3.  **Service Account (SA) pro CI/CD:**
    - Vytvořit nového Service Accounta (např. `github-ci-builder`).
    - Přidělit oprávnění (Roles):
        - `Artifact Registry Writer` (pro nahrávání images).
        - (Volitelně) `Cloud Run Admin` a `Service Account User` (pokud budeme i automaticky nasazovat).
    - Vygenerovat **JSON klíč** pro tento účet.

### GitHub Repository
V nastavení repozitáře (Settings -> Secrets and variables -> Actions) vytvořit následující secrets:
1.  `GCP_PROJECT_ID`: ID vašeho Google Cloud projektu.
2.  `GCP_SA_KEY`: Obsah JSON klíče Service Accounta (Base64 encoded nebo raw JSON).

### Lokální prostředí
- Nainstalovaný **Docker Desktop** (nebo Docker Engine + Compose plugin).

---

## 3. Plán realizace (Fáze transformace)

Celý proces rozdělíme do 4 fází.

### Fáze 1: Příprava Next.js konfigurace
Upravíme konfiguraci Next.js tak, aby generovala tzv. standalone build, který obsahuje pouze nezbytné soubory pro běh (bez dev dependencies).

**Kroky:**
1.  Úprava `next.config.mjs`: Přidání `output: "standalone"`.
2.  Kontrola `.dockerignore`: Zajištění, že nebudeme kopírovat zbytečné soubory (`.git`, `node_modules` lokálně, `.env.local`).
3.  Úprava `public/`: Ověření, že statické soubory jsou správně umístěny.

### Fáze 2: Tvorba `Dockerfile` (Production)
Vytvoříme optimalizovaný `Dockerfile` pro produkční nasazení. Použijeme "Multi-stage build" pro minimalizaci velikosti výsledného image.

**Struktura Dockerfile:**
1.  **Stage: deps** – Instalace závislostí (pouze `dependencies`).
2.  **Stage: builder** – Sestavení aplikace (`npm run build`).
3.  **Stage: runner** – Finální lehký image (Node.js Alpine), kopírování standalone výstupu, nastavení uživatele (security best practice - non-root user).

### Fáze 3: Lokální vývoj (`docker-compose`)
Připravíme konfiguraci pro snadné spuštění vývojového prostředí v Dockeru.

**Kroky:**
1.  Vytvoření `docker-compose.dev.yml` (nebo `docker-compose.yml`).
2.  Mapování portů (3000:3000).
3.  Mapování volumes (aby změny v kódu byly vidět hned bez rebuildu).
4.  Nastavení env proměnných pro vývoj.

### Fáze 4: CI/CD Pipeline (GitHub Actions)
Nastavíme automatizaci, která při každém pushi do `main` sestaví Docker image a nahraje ho do Google Artifact Registry.

**Kroky:**
1.  Vytvoření workflow souboru `.github/workflows/docker-publish.yml`.
2.  Kroky workflow:
    - Checkout kódu.
    - Autentizace do Google Cloud (pomocí `GCP_SA_KEY`).
    - Konfigurace Dockeru pro gcloud.
    - Build Docker image.
    - Push image do Artifact Registry.

---

## 4. Co bude potřeba ověřit po transformaci

1.  **Velikost Image:** Zkontrolovat, zda není image zbytečně velký (měl by být v řádu stovek MB, ne GB).
2.  **Environment Proměnné:** Ověřit, že aplikace v kontejneru správně čte proměnné (Supabase URL, Cloudinary keys) předané při startu kontejneru.
3.  **Sharp (Optimalizace obrázků):** Next.js v standalone módu někdy vyžaduje manuální doinstalování knihovny `sharp` pro optimalizaci obrázků, pokud není součástí base image. To ověříme při prvním buildu.
