'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function ProjetoIndexPage() {
  const router = useRouter();
  const params = useParams();
  const slugProjeto = params.slug_projeto;

  useEffect(() => {
    // Redireciona assim que o componente é montado
    if (slugProjeto) {
      router.replace(`/projeto/${slugProjeto}/desafios`);
    }
  }, [slugProjeto, router]);

  // Retorna null ou um loading para não exibir conteúdo temporário
  return null;
}