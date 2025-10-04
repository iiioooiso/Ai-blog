import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to `globalThis` in development to prevent
// exhausting your database connection limit.

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma || new PrismaClient({
  // log: ['query'], // optional
});

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

export default prisma;
