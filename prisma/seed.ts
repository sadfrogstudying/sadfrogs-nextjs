import { prisma } from "../src/server/db";
import slugify from "slugify";

async function main() {
  /** 
   * Uncomment this to delete all data in the database
    await prisma.studySpot.deleteMany();
    await prisma.location.deleteMany();
    await prisma.image.deleteMany();
  */

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
