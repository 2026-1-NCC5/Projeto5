'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

export default function NovoDesafioPage() {
  const router = useRouter();
  const { slug_projeto } = useParams();

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

    const novoDesafio = {
      nome,
      slug: gerarSlug(nome),
      dataInicio,
      dataFim,
      projetoSlug: slug_projeto // Vinculação com o projeto pai[cite: 4, 7]
    };

    try {
      const response = await fetch(`/api/projetos/${slug_projeto}/desafios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoDesafio),
      });

      if (response.ok) {
        router.push(`/projeto/${slug_projeto}/desafios`);
        router.refresh();
      } else {
        alert('Erro ao criar o desafio.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.formCard}>
        <header className={styles.header}>
          <Link href={`/projeto/${slug_projeto}/desafios`} className={styles.backBtn}>
            <span className="material-symbols-outlined">arrow_back</span>
            Voltar para Desafios
          </Link>
          <h1>Novo Desafio Operacional</h1>
        </header>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="nome">Nome do Desafio</label>
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
              {isSubmitting ? 'Cadastrando...' : 'Confirmar Desafio'}
            </button>
            
            <Link href={`/projeto/${slug_projeto}/desafios`} className={styles.cancelBtn}>
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}