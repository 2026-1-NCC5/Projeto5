'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function TurmasPage() {
  const router = useRouter();
  const params = useParams();
  const slugProjeto = params.slug_projeto;
  const slugEdicao = params.slug_edicao;
  const slugTurma = params.slug_turma;
  const username = params.username;

  useEffect(() => {
    if (slugProjeto && slugEdicao && slugTurma && username) {
      router.replace(`/${username}/${slugProjeto}/${slugEdicao}/${slugTurma}/alunos`);
    }
  }, [slugProjeto, slugEdicao, slugTurma, username, router]);

  return null;
}