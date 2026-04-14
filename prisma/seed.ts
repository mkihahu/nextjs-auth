import { Role } from "@/app/types";
import { PrismaClient, Prisma } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { hashPassword } from "@/app/lib/auth";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Starting database seed...");

  // Create teams
  const teams = await Promise.all([
    prisma.team.create({
      data: {
        name: "Engineering",
        description: "Software development team",
        code: "ENG-2026",
      },
    }),
    prisma.team.create({
      data: {
        name: "Marketing",
        description: "Marketing and sales team",
        code: "MKT-2026",
      },
    }),
    prisma.team.create({
      data: {
        name: "Operations",
        description: "Operations team",
        code: "OPS-2026",
      },
    }),
  ]);

  // Create sample users
  const sampleUsers = [
    {
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      team: teams[0], // Engineering
      role: Role.MANAGER,
    },
    {
      name: "Bob Smith",
      email: "bob.smith@example.com",
      team: teams[0], // Engineering,
      role: Role.USER,
    },
    {
      name: "John Marketer",
      email: "john.marketer@example.com",
      team: teams[1], // Marketing
      role: Role.MANAGER,
    },
    {
      name: "Jane Sales",
      email: "jane.sales@example.com",
      team: teams[1], // Marketing,
      role: Role.USER,
    },
    {
      name: "Tom Operations",
      email: "tom.operations@example.com",
      team: teams[2], // Operations
      role: Role.MANAGER,
    },
    {
      name: "Sara Ops",
      email: "sara.ops@example.com",
      team: teams[2], // Operations
      role: Role.USER,
    },
  ];

  for (const userData of sampleUsers) {
    await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: await hashPassword("12345678"),
        teamId: userData.team.id,
        role: userData.role,
      },
    });
  }

  console.log("Database seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("Seeding failed with error: ", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
