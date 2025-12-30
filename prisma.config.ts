import { definePrismaConfig } from '@prisma/config';

export default definePrismaConfig({
  // Pro prostředí jako Vercel/Render je ideální 'library' engine
  engineType: 'library',
  
  // Pokud používáš funkce z Prisma 7 early access, můžeš odkomentovat:
  // earlyAccess: true,
});