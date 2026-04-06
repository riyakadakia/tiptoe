import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getOrCreateUser } from '@/lib/user';

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: { url: string; headline: string; source: string; category: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress ?? '';
  await getOrCreateUser(userId, email);

  await db.readArticle.upsert({
    where: { userId_url: { userId, url: body.url } },
    update: { readAt: new Date() },
    create: {
      userId,
      url: body.url,
      headline: body.headline,
      source: body.source,
      category: body.category,
    },
  });

  return NextResponse.json({ ok: true });
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const reads = await db.readArticle.findMany({
    where: { userId },
    orderBy: { readAt: 'desc' },
    take: 100,
  });

  return NextResponse.json(reads);
}
