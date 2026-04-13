export const env = {
  hasNews: !!process.env.NEWS_API_KEY,
  hasChat: !!(process.env.ANTHROPIC_API_KEY || process.env.OPENROUTER_API_KEY),
  hasClerk: !!(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY),
  hasDb: !!process.env.DATABASE_URL,
};
