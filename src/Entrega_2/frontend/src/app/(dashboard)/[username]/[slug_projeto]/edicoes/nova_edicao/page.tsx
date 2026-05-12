'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useEdicoes } from '@/hooks/useEdicoes';
import styles from './page.module.css';

export default function NovaEdicaoPage() {
  const router = useRouter();
  const { username, slug_projeto } = useParams();
  const { addEdicao } = useEdicoes();

  // Estados do formulário
  const [nome, setNome] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const gerarSlug = (texto: string) => {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const novaEdicao = {
      nome,
      slug: gerarSlug(nome),
      dataInicio,
      dataFim,
      projetoSlug: slug_projeto 
    };

    try {
      await addEdicao(username as string, slug_projeto as string, novaEdicao);
      router.push(`/${username}/${slug_projeto}/edicoes`);
      router.refresh();
    } catch (error: any) {
      alert(error.message || 'Erro ao criar a edição.');
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.formCard}>
        <header className={styles.header}>
          <Link href={`/${username}/${slug_projeto}/edicoes`} className={styles.backBtn}>
            <span className="material-symbols-outlined">arrow_back</span>
            Voltar para Edições
          </Link>
          <h1>Nova Edição Operacional</h1>
        </header>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="nome">Nome da Edição</label>
            <input
              type="text"
              id="nome"
              placeholder="Ex: Coleta de Alimentos 2026"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="inicio">Data de Início</label>
            <input
              type="date"
              id="inicio"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="fim">Data de Encerramento</label>
            <input
              type="date"
              id="fim"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              required
            />
          </div>

          <div className={styles.actions}>
            <button 
              type="submit" 
              className={styles.submitBtn} 
              disabled={isSubmitting || !nome}
            >
              {isSubmitting ? 'Cadastrando...' : 'Confirmar Edição'}
            </button>
            
            <Link href={`/${username}/${slug_projeto}/edicoes`} className={styles.cancelBtn}>
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}