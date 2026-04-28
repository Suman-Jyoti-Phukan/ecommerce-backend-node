import { prisma } from "./db/prisma";

async function main() {
  const cats = await prisma.category.findMany({
    select: { id: true, name: true }
  });
  console.table(cats);
}

main().finally(() => prisma.$disconnect());
