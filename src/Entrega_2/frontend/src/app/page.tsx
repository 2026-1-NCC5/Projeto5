import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const username = cookieStore.get('username')?.value;

  if (token && username) {
    redirect(`/${username}/projetos`);
  }

  redirect('/login');
}
