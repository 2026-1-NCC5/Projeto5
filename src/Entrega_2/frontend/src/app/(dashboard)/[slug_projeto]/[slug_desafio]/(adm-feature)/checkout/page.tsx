'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CheckoutSession, CheckoutItemSynthesis } from '@/types';
import { SynthesisTable } from '@/components/Checkout/SynthesisTable';
import { CheckoutHistoryTable } from '@/components/Checkout/CheckoutHistoryTable';
import styles from './page.module.css';

export default function CheckoutOverviewPage() {
  const params = useParams();
  const { slug_projeto, slug_desafio } = params;
  
  const [sintese, setSintese] = useState<CheckoutItemSynthesis[]>([]);
  const [historico, setHistorico] = useState<CheckoutSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [resSintese, resHistorico] = await Promise.all([
          fetch('/api/checkout/sintese'),
          fetch('/api/checkout/historico')
        ]);
        
        if (resSintese.ok) setSintese(await resSintese.json());
        if (resHistorico.ok) setHistorico(await resHistorico.json());
      } catch (error) {
        console.error('Erro ao buscar dados de checkout:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const basePath = `/${slug_projeto}/${slug_desafio}/checkout`;

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Painel de Conferência (Checkout)</h1>
          <p className={styles.subtitle}>Acompanhe o progresso da verificação de itens registrados.</p>
        </div>
        
        <Link href={`${basePath}/scanner`} className={styles.newSessionBtn}>
          <span className="material-symbols-outlined">add_a_photo</span>
          Iniciar Nova Conferência
        </Link>
      </header>

      {isLoading ? (
        <div className={styles.loading}>Carregando dados do checkout...</div>
      ) : (
        <div className={styles.content}>
          <SynthesisTable data={sintese} />
          <CheckoutHistoryTable sessions={historico} />
        </div>
      )}
    </main>
  );
}
