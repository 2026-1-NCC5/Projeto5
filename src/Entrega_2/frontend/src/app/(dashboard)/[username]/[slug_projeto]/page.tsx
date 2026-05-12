'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function ProjetoIndexPage() {
  const router = useRouter();
  const params = useParams();
  const slugProjeto = params.slug_projeto;
  const username = params.username;

  useEffect(() => {
    // Redireciona assim que o componente é montado
    if (slugProjeto && username) {
      router.replace(`/${username}/${slugProjeto}/edicoes`);
    }
  }, [slugProjeto, username, router]);

  // Retorna null ou um loading para não exibir conteúdo temporário
  return null;
}