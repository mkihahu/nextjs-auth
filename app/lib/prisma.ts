import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
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

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
export default prisma;
