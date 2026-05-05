'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function DesafioIndexPage() {
  const router = useRouter();
  const params = useParams();
  const slugProjeto = params.slug_projeto;
  const slugDesafio = params.slug_desafio;

  useEffect(() => {
    // Redireciona para a página de turmas do desafio
    if (slugProjeto && slugDesafio) {
      router.replace(`/${slugProjeto}/${slugDesafio}/turmas`);
    }
  }, [slugProjeto, slugDesafio, router]);

  return null;
}