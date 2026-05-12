'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

import { useProject } from '@/contexts/ProjectContext';

export default function EdicaoIndexPage() {
  const router = useRouter();
  const params = useParams();
  const { papel, isLoading } = useProject();
  
  const slugProjeto = params.slug_projeto;
  const slugEdicao = params.slug_edicao;
  const username = params.username;

  useEffect(() => {
    if (isLoading || !slugProjeto || !slugEdicao || !username) return;

    if (papel === 'adm') {
      // Admins vão para a gestão de turmas
      router.replace(`/${username}/${slugProjeto}/${slugEdicao}/turmas`);
    } else {
      // Membros vão para a sua página inicial
      router.replace(`/${username}/${slugProjeto}/${slugEdicao}/home`);
    }
  }, [slugProjeto, slugEdicao, username, router, papel, isLoading]);

  return null;
}