import { PrismaClient, Gender } from "@prisma/client";
import * as fs from "fs";

const prisma = new PrismaClient();

// Jednoduchý CSV parser (zachováváme pro případný import)
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
  const result = [];
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

async function main() {
  console.log("🌱 Start seeding...");

  // --- 1. SEZÓNY ---
  console.log("Creating seasons...");
  const seasons = [
    { code: "2023", name: "Sezóna 2023", startDate: new Date("2023-01-01"), endDate: new Date("2023-12-31") },
    { code: "2024", name: "Sezóna 2024", startDate: new Date("2024-01-01"), endDate: new Date("2024-12-31") },
    { code: "2025", name: "Sezóna 2025", startDate: new Date("2025-01-01"), endDate: new Date("2025-12-31") },
    { code: "2026", name: "Sezóna 2026", startDate: new Date("2026-01-01"), endDate: new Date("2026-12-31") },
  ];

  for (const s of seasons) {
    await prisma.season.upsert({
      where: { code: s.code },
      update: {},
      create: s,
    });
  }

  // --- 2. VÝSLEDKY (Propojíme se sezónou 2024) ---
  console.log("Creating results...");
  const season2024 = await prisma.season.findUnique({ where: { code: "2024" } });
  if (season2024) {
    // Smažeme staré výsledky pro čistý start (volitelné)
    await prisma.result.deleteMany({ where: { seasonId: season2024.id } });

    await prisma.result.create({
      data: {
        seasonId: season2024.id,
        date: new Date("2024-05-15"),
        venue: "Sportovní hala Brno",
        teamName: "Sysmex & Friends",
        placement: 3,
        score: 1500,
        note: "Skvělý výkon v obraně!",
      },
    });
    
    await prisma.result.create({
      data: {
        seasonId: season2024.id,
        date: new Date("2024-06-20"),
        venue: "Letní turnaj Praha",
        teamName: "Sysmex & Friends",
        placement: 1,
        score: 2200,
        note: "Zlato je doma! 🏆",
      },
    });
  }

  // --- 3. ČLÁNKY (Aktuality) ---
  console.log("Creating posts...");
  const posts = [
    {
      slug: "vitame-novou-sezonu",
      title: "Vítáme novou sezónu 2025",
      excerpt: "Přípravy jsou v plném proudu a my se nemůžeme dočkat.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nová sezóna přináší nové výzvy...",
      isFeatured: true, // Hlavní článek
      coverImageUrl: "https://images.unsplash.com/photo-1579952363873-27f3bde9be51?auto=format&fit=crop&q=80&w=800",
    },
    {
      slug: "report-z-turnaje",
      title: "Reportáž z posledního turnaje",
      excerpt: "Jak se nám dařilo na víkendovém klání?",
      content: "Byl to náročný víkend, ale tým ukázal ducha...",
      isFeatured: false,
      coverImageUrl: null,
    },
  ];

  for (const p of posts) {
    await prisma.post.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }

  // --- 4. PLAYLISTY ---
  console.log("Creating playlists...");
  // Poznámka: URL by měla být embed link ze Spotify.
  // Prozatím dávám generic placeholder, v Adminu si ho můžeš upravit na přesný odkaz.
  await prisma.playlist.create({
    data: {
      title: "Chill Vibe Nexus - Paul & Fritz Kalkbrenner Tribute",
      spotifyUrl: "https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M", // Placeholder (nahradit reálným embed src)
      isActive: true,
    },
  });

  // --- 5. GALERIE ---
  console.log("Creating albums...");
  // Vytvoříme jedno album
  const album = await prisma.album.create({
    data: {
      title: "Teambuilding 2024",
      dateTaken: new Date("2024-08-10"),
      cloudinaryFolder: "samples", // Příklad složky
      photos: {
        create: [
          { cloudinaryPublicId: "sample", caption: "Společná fotka" },
          { cloudinaryPublicId: "cld-sample-2", caption: "Momentka ze hry" },
        ]
      }
    }
  });

  // --- 6. ČLENOVÉ (CSV + Fallback) ---
  console.log("Importing members...");
  let membersImported = false;
  try {
    const csvPath = "./members_import.csv";
    if (fs.existsSync(csvPath)) {
      const csvData = fs.readFileSync(csvPath, "utf-8");
      const records = parseCSV(csvData);

      for (const record of records) {
        const specialties = record.specialties 
          ? JSON.parse(record.specialties.replace(/\"/g, '"')) 
          : [];
        const isActive = record.isActive === "TRUE" || record.isActive === "true";

        await prisma.member.create({
          data: {
            displayName: record.displayName,
            nickname: record.nickname || null,
            gender: record.gender === "Female" ? Gender.FEMALE : Gender.MALE,
            role: record.role || null,
            specialties,
            bio: record.bio || null,
            avatarUrl: record.avatarUrl || null,
            isActive,
          },
        }).catch(() => {}); // Ignorujeme chyby (duplicity)
      }
      membersImported = true;
      console.log(`✓ Members imported from CSV`);
    }
  } catch (error) {
    console.warn("CSV import failed, using fallback.");
  }

  // Pokud nebyl import (nebo chybí CSV), vytvoříme jednoho ukázkového člena
  if (!membersImported) {
    await prisma.member.upsert({
      where: { id: "seed-member-1" }, // Zde fake ID nevadí
      update: {},
      create: {
        displayName: "Jan Novák",
        nickname: "Kanonýr",
        gender: Gender.MALE,
        role: "Útočník",
        specialties: ["Rychlost", "Přesnost"],
        bio: "Dlouholetý člen týmu a srdcař.",
        isActive: true,
      },
    });
    console.log("✓ Created fallback member");
  }

  console.log("✅ Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });