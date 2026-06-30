import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔄 Starting database image path updates (.jfif -> .jpg)...");

  // 1. VillageProfile (kepalaImage)
  const profiles = await prisma.villageProfile.findMany({
    where: { kepalaImage: { contains: ".jfif" } },
  });
  console.log(`Found ${profiles.length} VillageProfiles to update.`);
  for (const p of profiles) {
    if (p.kepalaImage) {
      await prisma.villageProfile.update({
        where: { id: p.id },
        data: { kepalaImage: p.kepalaImage.replace(/\.jfif/gi, ".jpg") },
      });
    }
  }

  // 2. News (image)
  const newsItems = await prisma.news.findMany({
    where: { image: { contains: ".jfif" } },
  });
  console.log(`Found ${newsItems.length} News items to update.`);
  for (const n of newsItems) {
    if (n.image) {
      await prisma.news.update({
        where: { id: n.id },
        data: { image: n.image.replace(/\.jfif/gi, ".jpg") },
      });
    }
  }

  // 3. Gallery (url)
  const galleries = await prisma.gallery.findMany({
    where: { url: { contains: ".jfif" } },
  });
  console.log(`Found ${galleries.length} Gallery items to update.`);
  for (const g of galleries) {
    await prisma.gallery.update({
      where: { id: g.id },
      data: { url: g.url.replace(/\.jfif/gi, ".jpg") },
    });
  }

  // 4. Potential (image)
  const potentials = await prisma.potential.findMany({
    where: { image: { contains: ".jfif" } },
  });
  console.log(`Found ${potentials.length} Potential items to update.`);
  for (const p of potentials) {
    if (p.image) {
      await prisma.potential.update({
        where: { id: p.id },
        data: { image: p.image.replace(/\.jfif/gi, ".jpg") },
      });
    }
  }

  // 5. Organization (image)
  const orgs = await prisma.organization.findMany({
    where: { image: { contains: ".jfif" } },
  });
  console.log(`Found ${orgs.length} Organization items to update.`);
  for (const o of orgs) {
    if (o.image) {
      await prisma.organization.update({
        where: { id: o.id },
        data: { image: o.image.replace(/\.jfif/gi, ".jpg") },
      });
    }
  }

  console.log("✅ Database image paths update completed!");
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
