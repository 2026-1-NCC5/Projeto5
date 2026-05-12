'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function UserIndexPage() {
  const router = useRouter();
  const { username } = useParams();

  useEffect(() => {
    if (username) {
      router.replace(`/${username}/projetos`);
    }
  }, [username, router]);

  return null;
}
