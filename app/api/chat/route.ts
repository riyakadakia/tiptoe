import Anthropic from '@anthropic-ai/sdk';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { type Article } from '@/lib/types';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface ChatRequest {
  messages: { role: 'user' | 'assistant'; content: string }[];
  articles: Article[];
}

async function getUserContext(userId: string): Promise<string> {
  const [user, recentReads] = await Promise.all([
    db.user.findUnique({ where: { id: userId } }),
    db.readArticle.findMany({
      where: { userId },
      orderBy: { readAt: 'desc' },
      take: 10,
    }),
  ]);

  if (!user) return '';

  const lines: string[] = [];

  if (user.aboutMe) {
    lines.push(`About this reader: ${user.aboutMe}`);
  }

  if (user.categories.length > 0) {
    lines.push(`Preferred categories: ${user.categories.join(', ')}`);
  }

  if (recentReads.length > 0) {
    const headlines = recentReads.map((r) => `"${r.headline}"`).join(', ');
    lines.push(`Articles they have recently read: ${headlines}`);
  }

  return lines.length > 0 ? `\n\nReader context:\n${lines.join('\n')}` : '';
}

function buildSystemPrompt(articles: Article[], userContext: string): string {
  const articleList = articles
    .map(
      (a, i) => `[${i + 1}] "${a.headline}" (${a.source})\n${a.summary}\nURL: ${a.url}`,
    )
    .join('\n\n');

  return `You are a helpful news assistant for NewsFlash, a news app for young readers. \
You have access to the following articles currently displayed on the page:

${articleList}${userContext}

Rules you must follow:
- Only discuss the articles listed above. Do not bring in outside facts or stories.
- You may explain background context a curious reader would want as long as you flag it is background knowledge, not from the article.
- If the reader context is provided, use it to tailor tone and depth — but never mention the profile explicitly or flatter the user.
- Never invent quotes, statistics, names, or dates not in the summaries.
- If asked about something not in today's articles, say clearly you do not have that information.
- Keep responses conversational and concise by default. Go deeper only when the user asks.
- Do not speculate or editorialize.`;
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'Chat is not available.' }, { status: 503 });
  }

  let body: ChatRequest;
  try {
    body = (await req.json()) as ChatRequest;
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { messages, articles } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: 'messages is required.' }, { status: 400 });
  }

  // Optionally inject user context if signed in and DB is available
  let userContext = '';
  if (process.env.DATABASE_URL) {
    try {
      const { userId } = await auth();
      if (userId) userContext = await getUserContext(userId);
    } catch {
      // Not fatal — proceed without user context
    }
  }

  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    system: buildSystemPrompt(articles, userContext),
    messages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
