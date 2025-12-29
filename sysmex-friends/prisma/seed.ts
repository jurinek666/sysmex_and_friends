import { PrismaClient, Gender } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Začínám seedování databáze...');

  // 1. Vyčistíme stará data (volitelné, ale dobré pro restart)
  // Pozor: Maže data v pořadí kvůli vztahům (Foreign Keys)
  await prisma.photo.deleteMany();
  await prisma.album.deleteMany();
  await prisma.result.deleteMany();
  await prisma.season.deleteMany();
  await prisma.member.deleteMany();
  await prisma.post.deleteMany();

  console.log('🧹 Stará data smazána.');

  // 2. Vytvoření Sezóny
  const season = await prisma.season.create({
    data: {
      code: '2024-2025',
      name: 'Sezóna 2024/2025',
      startDate: new Date('2024-09-01'),
      endDate: new Date('2025-06-30'),
    },
  });

  // 3. Vytvoření Členů týmu (Member)
  await prisma.member.createMany({
    data: [
      {
        displayName: 'Jan "Kapitán" Novák',
        nickname: 'Kapi',
        gender: Gender.MALE,
        role: 'Kapitán týmu',
        specialties: ['Strategie', 'Historie'],
        bio: 'Dlouholetý kapitán a duše týmu.',
        isActive: true,
      },
      {
        displayName: 'Petra Rychlá',
        nickname: 'Speedy',
        gender: Gender.FEMALE,
        role: 'Expert na vědu',
        specialties: ['Biologie', 'Chemie'],
        bio: 'Když neví ona, tak nikdo.',
        isActive: true,
      },
      {
        displayName: 'Tomáš Dvořák',
        gender: Gender.MALE,
        role: 'Všeuměl',
        specialties: ['Sport', 'Zeměpis'],
        isActive: true,
      },
      {
        displayName: 'Lenka Modrá',
        gender: Gender.FEMALE,
        specialties: ['Hudba', 'Film'],
        isActive: true,
      },
    ],
  });

  // 4. Vytvoření Článků (Post)
  // Hlavní článek (Featured)
  await prisma.post.create({
    data: {
      slug: 'uspech-na-chytrem-kvizu',
      title: 'Obrovský úspěch na Chytrém Kvízu!',
      excerpt: 'Náš tým SYSMEX & Friends vybojoval první místo v napínavém finále.',
      content: `
# Zlatá medaile je doma!

Včerejší večer byl plný emocí. Náš tým se sešel v plné sestavě a od začátku jsme tahali za delší konec provazu.

## Průběh večera
- **1. kolo:** Bezchybný výkon v historii.
- **2. kolo:** Mírné zaváhání u poznávačky hudby.
- **Finále:** Rozhodující otázka o hlavním městě Mongolska.

Děkujeme všem fanouškům za podporu!
      `,
      isFeatured: true,
      publishedAt: new Date(),
      coverImageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1000&auto=format&fit=crop', // Placeholder
    },
  });

  // Další články
  await prisma.post.create({
    data: {
      slug: 'novy-clen-tymu',
      title: 'Vítáme novou posilu',
      excerpt: 'Do týmu přichází expert na zeměpis Tomáš.',
      content: 'Tomáš posílí naše řady v oblasti geografie...',
      isFeatured: false,
    },
  });

  // 5. Vytvoření Výsledků (Result)
  await prisma.result.createMany({
    data: [
      {
        seasonId: season.id,
        date: new Date('2024-10-15'),
        venue: 'Restaurace U Medvěda',
        teamName: 'SYSMEX & Friends',
        placement: 1,
        score: 58,
        note: 'Rekordní počet bodů!',
      },
      {
        seasonId: season.id,
        date: new Date('2024-10-08'),
        venue: 'Restaurace U Medvěda',
        teamName: 'SYSMEX & Friends',
        placement: 3,
        score: 45,
      },
      {
        seasonId: season.id,
        date: new Date('2024-10-01'),
        venue: 'Pub Quiz Brno',
        teamName: 'SYSMEX A',
        placement: 2,
        score: 50,
      },
    ],
  });

  console.log('✅ Databáze byla úspěšně naplněna!');
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