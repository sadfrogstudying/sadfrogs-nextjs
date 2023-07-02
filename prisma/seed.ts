import { prisma } from "../src/server/db";

async function main() {
  await prisma.studySpot.deleteMany();
  await prisma.location.deleteMany();
  await prisma.image.deleteMany();
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
