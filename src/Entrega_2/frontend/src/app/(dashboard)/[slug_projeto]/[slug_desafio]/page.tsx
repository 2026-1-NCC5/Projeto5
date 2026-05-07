'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

import { useProject } from '@/contexts/ProjectContext';

export default function DesafioIndexPage() {
  const router = useRouter();
  const params = useParams();
  const { papel, isLoading } = useProject();
  
  const slugProjeto = params.slug_projeto;
  const slugDesafio = params.slug_desafio;

  useEffect(() => {
    if (isLoading || !slugProjeto || !slugDesafio) return;

    if (papel === 'adm') {
      // Admins vão para a gestão de turmas
      router.replace(`/${slugProjeto}/${slugDesafio}/turmas`);
    } else {
      // Membros vão para a sua página inicial
      router.replace(`/${slugProjeto}/${slugDesafio}/home`);
    }
  }, [slugProjeto, slugDesafio, router, papel, isLoading]);

  return null;
}