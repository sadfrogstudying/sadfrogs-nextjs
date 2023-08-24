import { prisma } from "../src/server/db";
import slugify from "slugify";

async function main() {
  /**
   await prisma.user.deleteMany();
   await prisma.studySpot.deleteMany();
   await prisma.pendingEdit.deleteMany();
   await prisma.openingHours.deleteMany();
   await prisma.image.deleteMany();
   await prisma.pendingImageToDelete.deleteMany();
  Comment this out to wipe database
  */

  return;

  const allStudySpots = await prisma.studySpot.findMany();
  const allStudySpotsNames = allStudySpots.map((s) => s.name);

  // Add slug to each study spot
  allStudySpotsNames.forEach(async (name) => {
    await prisma.studySpot.update({
      where: {
        name,
      },
      data: {
        slug: slugify(name, {
          remove: /[*+~.()'"!:@]/g,
          lower: true,
          strict: true,
        }),
      },
    });
  });
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
