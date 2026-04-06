import { db } from './db';
import type { User } from '@prisma/client';

// Lazy upsert — called at the top of every authenticated API route.
// Creates the User row on first request; subsequent calls are no-ops.
export async function getOrCreateUser(clerkId: string, email: string): Promise<User> {
  return db.user.upsert({
    where: { id: clerkId },
    update: {},
    create: { id: clerkId, email },
  });
}
