'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function TurmasPage() {
  const router = useRouter();
  const params = useParams();
  const slugProjeto = params.slug_projeto;
  const slugDesafio = params.slug_desafio;
  const slugTurma = params.slug_turma;

  useEffect(() => {
    if (slugProjeto && slugDesafio && slugTurma) {
      router.replace(`/${slugProjeto}/${slugDesafio}/${slugTurma}/alunos`);
    }
  }, [slugProjeto, slugDesafio, slugTurma, router]);

  return null;
}