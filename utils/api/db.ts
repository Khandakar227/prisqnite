import { PrismaClient, Prisma } from "@prisma/client";

class MyPrisma {
  static prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
  static getPrisma() {
    if (this.prisma === null || !this.prisma) this.prisma = new PrismaClient();
    return this.prisma;
  }
}

export default MyPrisma;
