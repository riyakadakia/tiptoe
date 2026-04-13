# NewsFlash

## What We're Building

NewsFlash is a news web application for disengaged young readers who want to stay informed but find traditional news overwhelming. The app pulls current stories from selected categories, summarizes them clearly, and provides a chatbot that can discuss any article in depth. Users sign in to save preferences, track what they have read, and get a chatbot that genuinely knows who they are.

This project is the final deliverable for a CMU course on media theory (Thinking In-Person vs. Thinking Online). The app is a direct response to the argument that current news media fails not because of bad writing but because of medium-level design: high entry cost, infinite scope, and no memory of the reader. Every design decision should trace back to fixing one of those three failures. The account system is not a growth-hack afterthought. It is the literal implementation of "memory of the reader" and should be treated as a core feature.

## Design Principles

These are not suggestions. Every feature should satisfy at least one, and no feature should violate any.

1. **Low entry cost.** A new visitor should see real content within five seconds of loading the page, before signing in. Sign-in unlocks personalization, it does not gate access.
2. **Bounded scope.** The user should never feel like they are staring into an infinite feed. Show a finite, curated set of stories per category per day. When they finish, they are done.
3. **Memory of the reader.** The app remembers preferred categories, which articles have been read, which have been saved, and a short "about me" profile the user writes themselves. The chatbot uses all of this as grounding context.
4. **Grounded conversation.** The chatbot never invents facts about news stories. It only discusses what is in the article summaries it has been given. If asked about something outside that context, it says so.
5. **Visual restraint.** The interface should feel calm, editorial, and confident. No gradients, no stacked drop shadows, no emoji in the UI chrome, no animated confetti. Think of a well-designed print magazine, not a SaaS landing page.

## Tech Stack

- **Framework:** Next.js 14+ with the App Router, TypeScript strict mode.
- **Styling:** Tailwind CSS. Use shadcn/ui for base components (Button, Card, Dialog, ScrollArea, Separator, Input, Textarea, Skeleton, Tabs, Badge).
- **Auth:** Clerk. Free tier, email and Google sign-in. Use `@clerk/nextjs` with the App Router middleware pattern.
- **Database:** Neon (serverless Postgres, free tier) accessed via Prisma ORM. Neon is chosen over Supabase because we are using Clerk for auth and do not need Supabase's auth features.
- **News data:** NewsAPI.org free developer tier. Endpoint: `/v2/top-headlines` with `country=us` and a category parameter. API key lives in `.env.local` as `NEWS_API_KEY` and is only read in server-side route handlers.
- **LLM:** Anthropic API, model `claude-sonnet-4-5` (or latest Sonnet). Key lives in `.env.local` as `ANTHROPIC_API_KEY`, server-side only. Use streaming responses.
- **Fallback:** If `NEWS_API_KEY` is missing or the request fails, serve hardcoded sample stories from `lib/fallback-stories.ts` so the app always runs for demos and grading.

## Environment Variables

All of these live in `.env.local` and are validated at startup in `lib/env.ts`:

```
NEWS_API_KEY=                    # optional, falls back to sample data
ANTHROPIC_API_KEY=                # required for chat
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
DATABASE_URL=                    # Neon connection string
```

If Clerk keys or `DATABASE_URL` are missing, the app boots in anonymous-only mode: stories render, chat works, but sign-in is disabled and nothing persists. This keeps local development and grading demos unblockable.

## Database Schema

Single Prisma schema, three models:

```prisma
model User {
  id            String    @id                    // Clerk user id
  email         String    @unique
  aboutMe       String?   @db.Text               // freeform profile, injected into chat
  categories    String[]  @default(["general"])  // preferred category slugs
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  reads         ReadArticle[]
  saves         SavedArticle[]
}

model ReadArticle {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  url         String
  headline    String
  source      String
  category    String
  readAt      DateTime @default(now())
  @@unique([userId, url])
  @@index([userId, readAt])
}

model SavedArticle {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  url         String
  headline    String
  source      String
  summary     String   @db.Text
  category    String
  savedAt     DateTime @default(now())
  @@unique([userId, url])
  @@index([userId, savedAt])
}
```

A User row is created lazily the first time a signed-in user hits any authenticated API route. Do not rely on Clerk webhooks for this. Just upsert on first request.

## Architecture

```
app/
  layout.tsx                 Root layout with ClerkProvider, fonts, theme
  page.tsx                   Main page: header, category tabs, story grid, chat drawer
  profile/page.tsx           Profile settings: about me, preferred categories
  saved/page.tsx             List of saved articles
  history/page.tsx           List of recently read articles
  api/
    news/route.ts            GET handler, fetches NewsAPI, returns normalized stories
    chat/route.ts            POST handler, proxies to Anthropic with article + user context
    user/route.ts            GET current user profile, PATCH to update
    reads/route.ts           POST to record a read, GET for history
    saves/route.ts           POST to save, DELETE to unsave, GET for saved list
middleware.ts                Clerk middleware, protects /api/user, /api/reads, /api/saves
components/
  Header.tsx                 App title, date, auth buttons (SignInButton or UserButton)
  CategoryTabs.tsx           Category selector, highlights user preferences when signed in
  StoryCard.tsx              Single article summary card
  StoryGrid.tsx              Grid of StoryCards with skeletons
  ChatDrawer.tsx             Slide-in chat panel
  ChatMessage.tsx            Single message bubble
  SaveButton.tsx             Bookmark toggle on each card
  ProfileForm.tsx            About-me textarea + category checkboxes
lib/
  news.ts                    fetchNews(category), normalizeArticle, types
  fallback-stories.ts        Hardcoded sample stories keyed by category
  db.ts                      Prisma client singleton
  user.ts                    getOrCreateUser(clerkId) helper
  env.ts                     Typed env var validation
  types.ts                   Article, ChatMessage, Category, UserProfile types
prisma/
  schema.prisma
```

## Feature Spec

### Header
App name "NewsFlash" in a serif display face. Today's date below it. On the right: when signed out, a small "Sign in" button. When signed in, the Clerk `<UserButton>` avatar with a dropdown menu that includes links to Profile, Saved, and History. No nav bar clutter beyond that.

### Category Tabs
Five categories: General, Technology, Business, Science, Health. Horizontal tab bar with an underline indicator for the active tab. For signed-in users, preferred categories (from their profile) are marked with a small filled dot next to the label. Clicking a tab swaps the grid. Default on load is the user's first preferred category if signed in, otherwise General.

### Story Grid
Display exactly 4 stories per category in a responsive grid (1 column mobile, 2 column tablet and desktop, forming a 2x2 layout). The grid should feel finite and intentional, not like a feed. Each StoryCard shows:
- Source name (small, uppercase, muted)
- Headline (serif, prominent, 2 line clamp)
- 2 to 3 sentence summary (sans-serif, comfortable line height)
- Publication time as relative ("3h ago")
- A "Discuss" button opening the chat drawer seeded with that article
- A SaveButton (bookmark icon) in the top-right corner of the card

Clicking a card's headline opens the original article in a new tab and fires a POST to `/api/reads` to record it. Stories the user has already read show a small muted "Read" badge. Saved stories show a filled bookmark.

At the top of each category view, include a small header that makes the bounded set explicit:
- "Today’s 4 stories in {Category}"

Track read progress above the grid using a row of small pill segments (one per story), filled with the accent color as stories are read, followed by "{X} of {N} read" in muted text. No percentage, no animated bar — discrete pills only.

When all stories have been read, replace the progress row with:
- "You’re done for today" (in the accent color, top-right of the header)
- Below the grid: "Discuss with the chatbot to go deeper on the stories you read today and 
check back tomorrow for a fresh set of stories!"(in the accent color)

The completion state is a core part of the product experience. It should feel calm and final — a gentle nudge toward the chatbot, not a prompt to consume more content. Do not add a "load more" or "refresh" affordance here.

### Profile Page (`/profile`)
Two sections:
1. **About me.** A textarea with placeholder text like "Tell NewsFlash who you are. Example: CMU engineering student, interested in tech policy and health." This text is injected into the chatbot's system prompt on every chat request.
2. **Preferred categories.** Checkbox list of the five categories. Saved changes update the `User.categories` array.

Both sections save via PATCH to `/api/user`. Show a subtle "Saved" confirmation, no modal.

### Saved Page (`/saved`)
Simple list or grid of saved articles with an unsave button on each. Empty state explains the feature briefly.

### History Page (`/history`)
Reverse-chronological list of read articles grouped by day. Empty state explains the feature briefly. No delete controls for now (keep it simple).

### Chat Drawer
Slide-in panel from the right, roughly 420px wide on desktop, full width on mobile. Scrollable message list, input fixed at the bottom. When opened from a StoryCard's Discuss button, the first assistant message is a short opener referencing that specific article. A floating chat button is always visible in the bottom-right corner for opening the drawer with no article context.

### Chat Behavior (the important part)
The `/api/chat` route builds a system prompt that includes:
1. Every article currently loaded on the page (headline, source, summary, URL)
2. If signed in, the user's `aboutMe` string and their preferred categories
3. If signed in, a short list of headlines they have recently read (last 10) so the assistant can reference them

The model is instructed to:
- Only discuss stories from the provided context
- Use the "about me" profile to tailor tone and depth, but never flatter the user or mention the profile explicitly unless asked
- Refuse to speculate about details not in the summary, and say so plainly when asked
- Not invent quotes, numbers, or names
- Keep responses conversational and short by default, longer only when the user asks for depth

Stream responses back to the client using the Anthropic streaming API.

## Visual Design

- **Typography:** Serif for headlines and the app title (Fraunces, Source Serif, or Newsreader via `next/font`). Sans-serif for body and UI (Inter or Geist).
- **Color:** Warm off-white background (`#FAFAF7`). Near-black text. One accent color used sparingly: active tab underline, primary buttons, filled bookmark. Pick a confident editorial color such as deep burnt orange or muted forest green. Pick one and commit.
- **Spacing:** Generous. Let cards breathe. Use Tailwind's spacing scale (4, 6, 8, 12, 16).
- **Borders and shadows:** Hairline borders (`border-neutral-200`) over shadows. At most one subtle shadow on the chat drawer.
- **Motion:** Minimal. Fade on grid swaps, slide on the chat drawer, nothing else.

## Coding Conventions

- TypeScript strict mode on. No `any` unless truly unavoidable, and comment why.
- Server components by default. Client components only where interactivity requires it.
- Tailwind classes sorted by the official plugin. No inline styles.
- Keep components under 150 lines. Split if they grow larger.
- API routes return typed JSON. Errors return a proper status code and `{ error: string }`. Client handles errors with inline messages, never silent failures.
- Prisma client is a singleton from `lib/db.ts` to avoid connection storms in dev.
- All authenticated API routes start by calling `auth()` from Clerk, then `getOrCreateUser(userId)` to ensure the User row exists.
- No `console.log` in committed code. Use a tiny `lib/log.ts` wrapper.

## Things Not To Do

- Do not gate the front page behind sign-in. Anonymous users see stories immediately.
- Do not add a search bar. Bounded scope is the point.
- Do not add infinite scroll or "load more" buttons.
- Do not use stock AI illustration styles (glowing orbs, purple gradients, neural network shapes).
- Do not add a "trending" or algorithmic "for you" feed.
- Do not have the chatbot proactively push articles the user has not looked at.
- Do not make up information anywhere in the app.
- Do not store chat history in the database for this version. It is out of scope.
- Do not use Clerk webhooks. Lazy upsert on first authenticated request is simpler and sufficient.
- Do not increase the number of stories beyond 4 per category or introduce layout patterns that suggest infinite or continuous content.

## Build Order

Work in this sequence and pause for review after each step before moving on.

1. Initialize Next.js with TypeScript, Tailwind, shadcn/ui. Set up fonts and base theme. Verify it builds and renders a placeholder page.
2. Build the static shell: Header, CategoryTabs with local state, empty StoryGrid with skeletons. No auth, no data yet.
3. Implement `/api/news` with NewsAPI integration and the fallback story set. Wire it into StoryGrid. App works fully for anonymous users at this point.
4. Polish StoryCard visuals until the grid looks genuinely good with real data. This is the most important visual milestone. Iterate here.
5. Add Clerk: install, configure middleware, add ClerkProvider to the layout, add sign-in button and UserButton to the Header. Anonymous flow must still work.
6. Set up Neon, Prisma, and the schema. Run the first migration. Write `lib/db.ts` and `lib/user.ts`.
7. Build `/api/user`, `/api/reads`, `/api/saves` with Clerk auth guards. Wire up SaveButton on StoryCard and the read-tracking fetch on headline click.
8. Build the Profile page with the about-me textarea and category checkboxes. Make sure preferred categories actually reorder the tab defaults.
9. Build the Saved and History pages.
10. Build ChatDrawer UI with mock messages.
11. Implement `/api/chat` with Anthropic streaming, article context, and (when signed in) user profile + recent reads injection.
12. Final pass: responsive breakpoints, loading states, empty states, error states, a careful read-through of every page on mobile.

## When In Doubt

If a design or product decision is ambiguous, stop and ask. Do not guess at product direction. Do guess freely at small implementation details (variable names, file organization, exact Tailwind values) as long as they follow the conventions above.