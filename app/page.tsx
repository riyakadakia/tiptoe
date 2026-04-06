import Header from '@/components/Header';
import NewsContent from '@/components/NewsContent';
import { env } from '@/lib/env';

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Header />
      <NewsContent chatAvailable={env.hasChat} clerkAvailable={env.hasClerk} />
    </main>
  );
}
