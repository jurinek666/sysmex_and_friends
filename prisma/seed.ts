import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as fs from "fs";

function ensureParam(url: string, key: string, value: string) {
  const u = new URL(url);
  if (!u.searchParams.has(key)) u.searchParams.set(key, value);
  return u.toString();
}

let connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("Chybí DATABASE_URL v prostředí (.env / Render env vars).");
}

const isLocal = /localhost|127\.0\.0\.1/i.test(connectionString);

// Pokud jedeš přes pooler (často Render), pgbouncer=true pomáhá proti padání spojení
if (!isLocal) {
  connectionString = ensureParam(connectionString, "pgbouncer", "true");
}

const pool = new Pool({
  connectionString,
  ssl: isLocal ? undefined : { rejectUnauthorized: false },
  max: 2,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
  keepAlive: true,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({
  adapter,
});

// --- CSV helpers (zůstává) ---
function parseCSV(csvData: string) {
  const lines = csvData.trim().split("\n");
  if (lines.length === 0) return [];

  const headers = parseCSVLine(lines[0]);
  const records = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    const values = parseCSVLine(line);
    const record: Record<string, string> = {};

    headers.forEach((header, index) => {
      record[header] = values[index] || "";
    });

    records.push(record);
  }

  return records;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

function safeParseSpecialties(raw: string | undefined): string[] {
  if (!raw) return [];
  try {
    const normalized = raw.replace(/\\"/g, '"');
    const parsed = JSON.parse(normalized);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function main() {
  console.log("Start seeding...");

  // --- SEZÓNY ---
  const seasons = [
    { code: "2023", name: "Sezóna 2023", startDate: new Date("2023-01-01"), endDate: new Date("2023-12-31") },
    { code: "2024", name: "Sezóna 2024", startDate: new Date("2024-01-01"), endDate: new Date("2024-12-31") },
    { code: "2025", name: "Sezóna 2025", startDate: new Date("2025-01-01"), endDate: new Date("2025-12-31") },
    { code: "2026", name: "Sezóna 2026", startDate: new Date("2026-01-01"), endDate: new Date("2026-12-31") },
  ];

  for (const s of seasons) {
    await prisma.season.upsert({
      where: { code: s.code },
      update: { name: s.name, startDate: s.startDate, endDate: s.endDate },
      create: s,
    });
  }
  console.log(`✓ ${seasons.length} seasons upserted`);

  // --- DEMO ČLÁNKY (Post) ---
  const posts = [
    {
      slug: "vitejte-na-sysmex-friends",
      title: "Vítejte na SYSMEX & Friends",
      excerpt: "Nový web je venku. Tady je rychlý přehled, co na něm najdete a co chystáme.",
      content: `## Ahoj!\n\nTohle je demo článek, aby byla sekce Aktuality hned „živá“.\n\n- Aktuality budou v DB\n- Články se generují podle slug\n- Admin sekce umožní pohodlnou správu\n`,
      isFeatured: true,
      publishedAt: new Date(),
      coverImageUrl: null as string | null,
    },
    {
      slug: "kvizove-vecery-a-vysledky",
      title: "Kvízové večery a výsledky",
      excerpt: "Jak budeme evidovat večery, výsledky a sezóny. A co přidáme dál.",
      content: `## Výsledky\n\nZáznamy večerů a výsledků patří do DB.\n\nDalší krok: doplnit seed i o demo výsledky, pokud chceš mít sekci naplněnou hned od začátku.`,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 86400000),
      coverImageUrl: null as string | null,
    },
    {
      slug: "jak-spravovat-obsah-v-adminu",
      title: "Jak spravovat obsah v adminu",
      excerpt: "Stručný postup, jak přidat článek, playlist a aktualizovat obsah bez zásahu do kódu.",
      content: `## Admin\n\n- Přidání článku: **/admin/posts**\n- Playlists: **/admin/playlists**\n\nDoporučení: data seeduj jen pro demo, reálný obsah řeš adminem.`,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 2 * 86400000),
      coverImageUrl: null as string | null,
    },
  ];

  for (const p of posts) {
    await prisma.post.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        isFeatured: p.isFeatured,
        publishedAt: p.publishedAt,
        coverImageUrl: p.coverImageUrl,
      },
      create: {
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        isFeatured: p.isFeatured,
        publishedAt: p.publishedAt,
        coverImageUrl: p.coverImageUrl,
      },
    });
  }
  console.log(`✓ ${posts.length} posts upserted`);

  // --- PLAYLIST (jen pokud dodáš URL) ---
  const playlistUrl = process.env.SEED_PLAYLIST_URL?.trim();
  const playlistTitle = (process.env.SEED_PLAYLIST_TITLE || "Good Vibe Playlist").trim();

  if (playlistUrl) {
    // Pokud nastavujeme aktivní demo playlist, vypneme ostatní
    await prisma.playlist.updateMany({ data: { isActive: false } });

    await prisma.playlist.upsert({
      where: { spotifyUrl: playlistUrl },
      update: { title: playlistTitle, isActive: true },
      create: { title: playlistTitle, spotifyUrl: playlistUrl, isActive: true },
    });

    console.log("✓ playlist upserted (active)");
  } else {
    console.log("SEED_PLAYLIST_URL není nastavené – playlist se nepřidal.");
  }

  // --- ČLENOVÉ Z CSV (pokud existuje) ---
  const csvPath = "./members_import.csv";
  if (fs.existsSync(csvPath)) {
    console.log("Importing members from CSV...");
    const csvData = fs.readFileSync(csvPath, "utf-8");
    const records = parseCSV(csvData);

    for (const record of records) {
      if (!record.displayName) continue;

      const specialties = safeParseSpecialties(record.specialties);
      const isActive = record.isActive === "TRUE" || record.isActive === "true";
      const gender = record.gender === "Female" ? "FEMALE" : "MALE";

      await prisma.member.upsert({
        where: { displayName: record.displayName },
        update: {
          nickname: record.nickname || null,
          gender,
          role: record.role || null,
          specialties,
          bio: record.bio || null,
          avatarUrl: record.avatarUrl || null,
          isActive,
        },
        create: {
          displayName: record.displayName,
          nickname: record.nickname || null,
          gender,
          role: record.role || null,
          specialties,
          bio: record.bio || null,
          avatarUrl: record.avatarUrl || null,
          isActive,
        },
      });
    }

    console.log(`✓ ${records.length} members upserted`);
  } else {
    console.log("members_import.csv nenalezen – členové se nepřidali.");
  }

  console.log("✅ Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
