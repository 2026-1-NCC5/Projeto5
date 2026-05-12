'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProject } from '@/contexts/ProjectContext';
import { Edicao } from '@/types';
import styles from './page.module.css';

import { useEdicoes } from '@/hooks/useEdicoes';

export default function InfoEdicaoPage() {
  const { projeto, edicao, isLoading: projectLoading } = useProject();
  const { username, slug_projeto, slug_edicao } = useParams();
  const router = useRouter();

  const { updateEdicao } = useEdicoes();
  
  const [nome, setNome] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Carrega dados iniciais do contexto
  useEffect(() => {
    if (edicao) {
      setNome(edicao.nome);
      // Backend usa data_inicio/data_fim. Se vierem como datetime (ISO), 
      // precisamos apenas da parte YYYY-MM-DD para o input type="date"
      setDataInicio(edicao.data_inicio?.split('T')[0] || '');
      setDataFim(edicao.data_fim?.split('T')[0] || '');
    }
  }, [edicao]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Mapeamento correto para o Backend
    const updateData: Partial<Edicao> = {
      nome,
      data_inicio: dataInicio,
      data_fim: dataFim
    };

    try {
      const updated = await updateEdicao(username as string, slug_projeto as string, slug_edicao as string, updateData);
      
      if (updated) {
        alert('Edição atualizada com sucesso!');
        if (updated.slug !== slug_edicao) {
          router.replace(`/${username}/${slug_projeto}/${updated.slug}/informacoes`);
        }
      }
    } catch (error: any) {
      console.error('Erro na requisição:', error);
      alert(error.message || 'Erro ao atualizar edição.');
    } finally {
      setIsSaving(false);
    }
  };

  if (projectLoading) {
    return <div className={styles.loading}>Carregando informações da edição...</div>;
  }

  if (projeto?.papel !== 'adm') {
    return <div className={styles.error}>Acesso restrito a administradores.</div>;
  }

  if (!edicao) {
    return <div className={styles.error}>Edição não encontrada.</div>;
  }

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Configurações da Edição</h1>
        <p className={styles.subtitle}>Gerencie o cronograma e os detalhes desta etapa.</p>
      </header>

      <form onSubmit={handleSave} className={styles.form}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Cronograma</h2>
          <div className={styles.grid}>
            <div className={styles.inputGroup}>
              <label htmlFor="nome">Nome da Edição</label>
              <input 
                id="nome"
                type="text" 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="inicio">Data de Início</label>
              <input 
                id="inicio"
                type="date" 
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="fim">Data de Encerramento</label>
              <input 
                id="fim"
                type="date" 
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                required
              />
            </div>
          </div>
        </section>

        <div className={styles.actions}>
          <button type="submit" className={styles.saveBtn} disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </main>
  );
}
