import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

async function main() {
  console.log("Seeding database...");

  // Charities
  const [redCross, unicef, wwf, msf] = await Promise.all([
    prisma.charity.upsert({
      where: { id: "charity-red-cross" },
      update: {},
      create: { id: "charity-red-cross", name: "Red Cross", description: "International humanitarian organization providing emergency assistance and disaster relief." },
    }),
    prisma.charity.upsert({
      where: { id: "charity-unicef" },
      update: {},
      create: { id: "charity-unicef", name: "UNICEF", description: "United Nations agency providing humanitarian aid to children worldwide." },
    }),
    prisma.charity.upsert({
      where: { id: "charity-wwf" },
      update: {},
      create: { id: "charity-wwf", name: "WWF", description: "World Wildlife Fund — leading conservation organization protecting nature and wildlife." },
    }),
    prisma.charity.upsert({
      where: { id: "charity-msf" },
      update: {},
      create: { id: "charity-msf", name: "Doctors Without Borders", description: "MSF delivers emergency medical care in conflict zones and disaster areas." },
    }),
  ]);

  const passwordHash = bcrypt.hashSync("password123", 12);

  // Users
  const [admin, alice, bob, charlie] = await Promise.all([
    prisma.user.upsert({
      where: { email: "admin@golfix.com" },
      update: {},
      create: { id: "user-admin", email: "admin@golfix.com", password: passwordHash, role: "ADMIN", subscriptionStatus: "ACTIVE", charityId: redCross.id, charityPercentage: 10 },
    }),
    prisma.user.upsert({
      where: { email: "alice@example.com" },
      update: {},
      create: { id: "user-alice", email: "alice@example.com", password: passwordHash, role: "USER", subscriptionStatus: "ACTIVE", charityId: unicef.id, charityPercentage: 15 },
    }),
    prisma.user.upsert({
      where: { email: "bob@example.com" },
      update: {},
      create: { id: "user-bob", email: "bob@example.com", password: passwordHash, role: "USER", subscriptionStatus: "ACTIVE", charityId: wwf.id, charityPercentage: 10 },
    }),
    prisma.user.upsert({
      where: { email: "charlie@example.com" },
      update: {},
      create: { id: "user-charlie", email: "charlie@example.com", password: passwordHash, role: "USER", subscriptionStatus: "INACTIVE", charityId: msf.id, charityPercentage: 20 },
    }),
  ]);

  // Scores for alice (5 scores)
  const aliceScores = [72, 68, 75, 71, 69];
  for (let i = 0; i < aliceScores.length; i++) {
    const date = new Date(2026, 3, i + 1); // April 1-5 2026
    await prisma.score.upsert({
      where: { userId_date: { userId: alice.id, date } },
      update: {},
      create: { userId: alice.id, score: aliceScores[i]!, date },
    });
  }

  // Scores for bob (5 scores)
  const bobScores = [80, 77, 82, 79, 76];
  for (let i = 0; i < bobScores.length; i++) {
    const date = new Date(2026, 3, i + 1);
    await prisma.score.upsert({
      where: { userId_date: { userId: bob.id, date } },
      update: {},
      create: { userId: bob.id, score: bobScores[i]!, date },
    });
  }

  // Scores for admin (3 scores)
  const adminScores = [65, 70, 68];
  for (let i = 0; i < adminScores.length; i++) {
    const date = new Date(2026, 3, i + 1);
    await prisma.score.upsert({
      where: { userId_date: { userId: admin.id, date } },
      update: {},
      create: { userId: admin.id, score: adminScores[i]!, date },
    });
  }

  // March 2026 draw
  const draw = await prisma.draw.upsert({
    where: { month: new Date(2026, 2, 1) }, // March 1 2026
    update: {},
    create: { id: "draw-march-2026", month: new Date(2026, 2, 1), numbers: [7, 18, 25, 32, 41] },
  });

  // Alice wins 4-match
  await prisma.winner.upsert({
    where: { id: "winner-alice-march" },
    update: {},
    create: { id: "winner-alice-march", userId: alice.id, drawId: draw.id, matchType: 4, status: "PENDING" },
  });

  console.log("Seed complete.");
  console.log(`  Charities: ${[redCross, unicef, wwf, msf].map(c => c.name).join(", ")}`);
  console.log(`  Users: admin@golfix.com, alice@example.com, bob@example.com, charlie@example.com (password: password123)`);
  console.log(`  Draw: March 2026 — numbers [7, 18, 25, 32, 41]`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
