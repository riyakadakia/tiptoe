import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getOrCreateUser } from '@/lib/user';
import { type Category, CATEGORIES } from '@/lib/types';

const validCategories = new Set<string>(CATEGORIES.map((c) => c.id));

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress ?? '';

  const user = await getOrCreateUser(userId, email);
  return NextResponse.json({
    id: user.id,
    email: user.email,
    aboutMe: user.aboutMe,
    categories: user.categories,
  });
}

export async function PATCH(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: { aboutMe?: string; categories?: string[] };
  try {
    body = (await req.json()) as { aboutMe?: string; categories?: string[] };
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const update: { aboutMe?: string; categories?: string[] } = {};

  if (typeof body.aboutMe === 'string') {
    update.aboutMe = body.aboutMe.slice(0, 2000);
  }

  if (Array.isArray(body.categories)) {
    const cleaned = body.categories.filter((c) => validCategories.has(c));
    if (cleaned.length > 0) update.categories = cleaned;
  }

  const user = await db.user.update({ where: { id: userId }, data: update });
  return NextResponse.json({
    id: user.id,
    aboutMe: user.aboutMe,
    categories: user.categories as Category[],
  });
}
