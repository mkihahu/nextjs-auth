import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

export const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

// Database helper function
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`Select 1`;
    return true;
  } catch (error) {
    console.error(`Database connection failed: ${error}`);
    return false;
  }
}
