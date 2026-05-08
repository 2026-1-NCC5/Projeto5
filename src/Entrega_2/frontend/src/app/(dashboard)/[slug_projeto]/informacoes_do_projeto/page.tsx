'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProject } from '@/contexts/ProjectContext';
import { ProjetoTipo, Projeto } from '@/types';
import { AdminListManager } from '@/components/ProjectInfo/AdminListManager';
import styles from './page.module.css';

export default function InfoProjetoPage() {
  const { projeto, isLoading: projectLoading } = useProject();
  const { slug_projeto } = useParams();
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState<ProjetoTipo>('Projeto Social Estudantil');
  const [descricao, setDescricao] = useState('');
  const [admins, setAdmins] = useState<string[]>([]);
  const [ativo, setAtivo] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Carrega dados iniciais do contexto
  useEffect(() => {
    if (projeto) {
      setNome(projeto.nome);
      setTipo(projeto.tipo);
      setDescricao(projeto.descricao || '');
      setAdmins(projeto.admins || ['admin@exemplo.com']); // Default se vazio
      setAtivo(projeto.ativo);
    }
  }, [projeto]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const updateData: Partial<Projeto> = {
      nome,
      tipo,
      descricao,
      admins,
      ativo
    };

    try {
      const response = await fetch(`/api/projetos/${slug_projeto}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        alert('Projeto atualizado com sucesso!');
        // Se o nome mudou, o slug pode ter mudado, então redirecionamos para o novo slug
        const updatedProject = await response.json();
        if (updatedProject.slug !== slug_projeto) {
          router.replace(`/${updatedProject.slug}/informacoes_do_projeto`);
        }
      } else {
        alert('Erro ao atualizar projeto.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro de conexão.');
    } finally {
      setIsSaving(false);
    }
  };

  if (projectLoading) {
    return <div className={styles.loading}>Carregando informações do projeto...</div>;
  }

  if (projeto?.papel !== 'adm') {
    return null;
  }

  if (!projeto) {
    return <div className={styles.error}>Projeto não encontrado.</div>;
  }

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Configurações do Projeto</h1>
        <p className={styles.subtitle}>Gerencie os detalhes e permissões deste projeto.</p>
      </header>

      <form onSubmit={handleSave} className={styles.form}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Identificação</h2>
          <div className={styles.grid}>
            <div className={styles.inputGroup}>
              <label htmlFor="nome">Nome do Projeto</label>
              <input 
                id="nome"
                type="text" 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="tipo">Tipo de Projeto</label>
              <select 
                id="tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value as ProjetoTipo)}
              >
                <option value="Comercial">Comercial</option>
                <option value="Departamento de Empresa">Departamento de Empresa</option>
                <option value="Projeto Social">Projeto Social</option>
                <option value="Projeto Social Estudantil">Projeto Social Estudantil</option>
              </select>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Sobre o Projeto</h2>
          <div className={styles.inputGroup}>
            <label htmlFor="descricao">Descrição / Objetivo</label>
            <textarea 
              id="descricao"
              rows={4}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva o propósito deste projeto..."
            />
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Gestão de Acesso (Admins)</h2>
          <AdminListManager admins={admins} onUpdate={setAdmins} />
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Status e Visibilidade</h2>
          <div className={styles.toggleRow}>
            <div className={styles.toggleInfo}>
              <span className={styles.toggleLabel}>Projeto Ativo</span>
              <span className={styles.toggleDesc}>
                Se inativo, o projeto não aparecerá nas listagens de novos membros.
              </span>
            </div>
            <label className={styles.switch}>
              <input 
                type="checkbox" 
                checked={ativo}
                onChange={(e) => setAtivo(e.target.checked)}
              />
              <span className={styles.slider}></span>
            </label>
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
