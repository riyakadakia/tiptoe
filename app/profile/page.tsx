import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getOrCreateUser } from '@/lib/user';
import ProfileForm from '@/components/ProfileForm';
import { type UserProfile, type Category } from '@/lib/types';

export default async function ProfilePage() {
  const { userId } = await auth();
  if (!userId) redirect('/');

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress ?? '';
  const user = await getOrCreateUser(userId, email);

  const profile: UserProfile = {
    id: user.id,
    email: user.email,
    aboutMe: user.aboutMe,
    categories: user.categories as Category[],
  };

  return (
    <main className="mx-auto w-full max-w-xl px-6 py-12">
      <Link href="/" className="text-xs text-muted-foreground underline-offset-2 hover:underline">
        ← NewsFlash
      </Link>
      <h1 className="mt-6 font-serif text-3xl font-bold tracking-tight">Profile</h1>
      <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
      <div className="mt-8">
        <ProfileForm profile={profile} />
      </div>
    </main>
  );
}
