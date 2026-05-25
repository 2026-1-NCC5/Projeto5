'use client';

import React from 'react';
import styles from './page.module.css';
import { useCheckoutAI } from '@/hooks/useCheckoutAI';
import { VisionPanel } from '@/components/Checkout/VisionPanel';
import { ScannedItemsLog } from '@/components/Checkout/ScannedItemsLog';
import { ItemsSummary } from '@/components/Checkout/ItemsSummary';
import { CalibrationPanel } from '@/components/Checkout/CalibrationPanel';
import { useCheckout } from '@/hooks/useCheckout';
import { useItems } from '@/hooks/useItems';
import { useProject } from '@/contexts/ProjectContext';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();

  const { items, fetchCatalogo } = useItems();

  useEffect(() => {
    fetchCatalogo(
      params.username as string,
      params.slug_projeto as string,
      params.slug_edicao as string
    );
  }, [fetchCatalogo, params.username, params.slug_projeto, params.slug_edicao]);

  const {
    itens,
    engineStatus,
    camStatus,
    cooldown,
    setCooldown,
    isCalibrating,
    setIsCalibrating,
    calibrationSize,
    setCalibrationSize,
    videoRef,
    canvasRef,
    handleCancel
  } = useCheckoutAI(items);

  const { user } = useProject();
  const { submitConferencia } = useCheckout();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinish = async () => {
    if (itens.length === 0) {
      alert('O carrinho está vazio!');
      return;
    }

    if (!confirm('Deseja finalizar a conferência de itens?')) {
      return;
    }

    if (!user) {
      alert('Sua sessão expirou ou você não está autenticado. Por favor, faça login novamente.');
      return;
    }

    setIsSubmitting(true);
    console.log('Iniciando submissão de checkout...', { itens, user });

    try {
      // Usamos o catalogoId real do banco, não o ID randômico da lista
      const itens_ids = itens.map(it => it.catalogoId).filter(id => id > 0);
      
      const payload = {
        adm_id: user.id,
        itens_ids: itens_ids
      };

      console.log('Payload sendo enviado:', payload);

      const result = await submitConferencia(
        params.username as string, 
        params.slug_projeto as string, 
        params.slug_edicao as string, 
        payload as any
      );

      if (result) {
        alert('Conferência finalizada com sucesso!');
        handleCancel(); // Limpa o carrinho
        // Redireciona para a página de checkout (histórico)
        router.push(`/${params.username}/${params.slug_projeto}/${params.slug_edicao}/checkout`);
      } else {
        alert('Ocorreu um erro ao salvar o checkout no servidor.');
      }
    } catch (error) {
      console.error('Erro crítico no handleFinish:', error);
      alert('Erro ao finalizar conferência. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <Link href={`/${params.username}/${params.slug_projeto}/${params.slug_edicao}/checkout`} className={styles.backBtn}>
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div className={styles.titleGroup}>
            <h1>Checkout Inteligente</h1>
            <p>Detecção de produtos em tempo real via ScanCount AI</p>
          </div>
        </div>
        <button 
          className={styles.finishBtn} 
          onClick={handleFinish}
          disabled={isSubmitting || itens.length === 0}
        >
          {isSubmitting ? 'Enviando...' : 'Finalizar Conferência'}
        </button>
      </header>

      <div className={styles.contentGrid}>
        {/* Lado Esquerdo: Visão e Configurações */}
        <div className={styles.leftColumn}>
          <CalibrationPanel 
            isCalibrating={isCalibrating}
            setIsCalibrating={setIsCalibrating}
            calibrationSize={calibrationSize}
            setCalibrationSize={setCalibrationSize}
            cooldown={cooldown}
            setCooldown={setCooldown}
          />
          <VisionPanel 
            videoRef={videoRef}
            canvasRef={canvasRef}
            engineStatus={engineStatus}
            camStatus={camStatus}
          />
        </div>

        {/* Lado Direito: Fluxo e Síntese */}
        <div className={styles.rightColumn}>
          <div className={styles.sidebarContent}>
            <ScannedItemsLog itens={itens} />
            <ItemsSummary itens={itens} />
            
            {itens.length > 0 && (
              <button className={styles.clearBtn} onClick={handleCancel}>
                Reiniciar Carrinho
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}