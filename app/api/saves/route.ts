import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getOrCreateUser } from '@/lib/user';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const saves = await db.savedArticle.findMany({
    where: { userId },
    orderBy: { savedAt: 'desc' },
  });

  return NextResponse.json(saves);
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: { url: string; headline: string; source: string; summary: string; category: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress ?? '';
  await getOrCreateUser(userId, email);

  await db.savedArticle.upsert({
    where: { userId_url: { userId, url: body.url } },
    update: {},
    create: { userId, ...body },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  if (!url) return NextResponse.json({ error: 'url param required.' }, { status: 400 });

  await db.savedArticle.deleteMany({ where: { userId, url } });
  return NextResponse.json({ ok: true });
}
