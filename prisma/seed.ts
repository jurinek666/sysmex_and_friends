import { PrismaClient } from "@prisma/client";
import * as fs from "fs";

const prisma = new PrismaClient();

// Jednoduchý CSV parser bez externích závislostí - s podporou quoted fields
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

// Parser pro jednotlivý řádek CSV s podporou quoted fields
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
        i++; // Skip next quote
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
    // Některé exporty mívají JSON string s escapovanými uvozovkami
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
    {
      code: "2023",
      name: "Sezóna 2023",
      startDate: new Date("2023-01-01"),
      endDate: new Date("2023-12-31"),
    },
    {
      code: "2024",
      name: "Sezóna 2024",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-12-31"),
    },
    {
      code: "2025",
      name: "Sezóna 2025",
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-12-31"),
    },
    {
      code: "2026",
      name: "Sezóna 2026",
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-12-31"),
    },
  ];

  for (const s of seasons) {
    await prisma.season.upsert({
      where: { code: s.code },
      update: {
        name: s.name,
        startDate: s.startDate,
        endDate: s.endDate,
      },
      create: s,
    });
  }
  console.log(`✓ ${seasons.length} seasons upserted`);

  // --- ČLENOVÉ Z CSV ---
  const csvPath = "./members_import.csv";
  if (fs.existsSync(csvPath)) {
    console.log("Importing members from CSV...");
    const csvData = fs.readFileSync(csvPath, "utf-8");
    const records = parseCSV(csvData);

    for (const record of records) {
      const specialties = safeParseSpecialties(record.specialties);
      const isActive = record.isActive === "TRUE" || record.isActive === "true";

      const gender = record.gender === "Female" ? "FEMALE" : "MALE";

      const existingMember = await prisma.member.findUnique({
        where: { displayName: record.displayName },
      });

      if (existingMember) {
        await prisma.member.update({
          where: { id: existingMember.id },
          data: {
            nickname: record.nickname || null,
            gender,
            role: record.role || null,
            specialties,
            bio: record.bio || null,
            avatarUrl: record.avatarUrl || null,
            isActive,
          },
        });
      } else {
        await prisma.member.create({
          data: {
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
    }

    console.log(`✓ ${records.length} members upserted`);
  } else {
    console.log("members_import.csv nenalezen – seed vytvořil pouze sezóny.");
  }

  console.log("Seeding finished.");
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
