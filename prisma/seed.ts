import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // --- SEZÓNY ---
  // Oprava: Přidáno povinné pole 'endDate'
  const seasons = [
    { 
      code: "2023", 
      name: "Sezóna 2023", 
      startDate: new Date("2023-01-01"),
      endDate: new Date("2023-12-31") 
    },
    { 
      code: "2024", 
      name: "Sezóna 2024", 
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-12-31")
    },
    { 
      code: "2025", 
      name: "Sezóna 2025", 
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-12-31")
    },
    { 
      code: "2026", 
      name: "Sezóna 2026", 
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-12-31")
    },
  ];

  for (const s of seasons) {
    await prisma.season.upsert({
      where: { code: s.code },
      update: {}, // Pokud existuje, nic neměň
      create: s,  // Pokud neexistuje, vytvoř ji i s endDate
    });
  }

  console.log("Seeding finished.");
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