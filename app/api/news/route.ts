import { NextRequest, NextResponse } from 'next/server';
import { fetchNews, isValidCategory } from '@/lib/news';

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get('category');

  if (!isValidCategory(category)) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  }

  const articles = await fetchNews(category);
  return NextResponse.json(articles);
}
