import { definePrismaConfig } from '@prisma/config';

export default definePrismaConfig({
  // Zapnutí early access funkcí pro Prisma 7
  earlyAccess: true,
  
  // V Prisma 7+ je standardem 'library' engine pro lepší výkon
  // Pokud bys měl problémy na specifickém OS, můžeš zkusit 'binary'
  // engineType: 'library',
});