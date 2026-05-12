'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProject } from '@/contexts/ProjectContext';
import { ProjetoTipo, Projeto } from '@/types';
import { AdminListManager } from '@/components/ProjectInfo/AdminListManager';
import styles from './page.module.css';

import { useProjetos } from '@/hooks/useProjetos';

export default function InfoProjetoPage() {
  const { projeto, isLoading: projectLoading } = useProject();
  const { username, slug_projeto } = useParams();
  const router = useRouter();

  const { updateProjeto } = useProjetos();
  
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState<ProjetoTipo>('Projeto Social Estudantil');
  const [descricao, setDescricao] = useState('');
  const [admins, setAdmins] = useState<string[]>([]);
  const [display, setDisplay] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Carrega dados iniciais do contexto
  useEffect(() => {
    if (projeto) {
      setNome(projeto.nome);
      // Mapeia o status do backend para o tipo do frontend se necessário
      setTipo((projeto.status as ProjetoTipo) || 'Projeto Social Estudantil');
      setDescricao(projeto.descricao || '');
      // No momento o backend não retorna lista de admins no objeto projeto,
      // então mantemos um mock ou o que vier do contexto
      setAdmins(['admin@exemplo.com']); 
      setDisplay(projeto.display);
    }
  }, [projeto]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Mapeamento para o Backend (ProjetoUpdate schema)
    const updateData: Partial<Projeto> = {
      nome,
      status: tipo, // Usando status para guardar o tipo
      descricao,
      display
      // admins: admins // Removido pois o schema ProjetoUpdate não aceita admins ainda
    };

    try {
      const updatedProject = await updateProjeto(username as string, slug_projeto as string, updateData);
      
      if (updatedProject) {
        alert('Projeto atualizado com sucesso!');
        if (updatedProject.slug !== slug_projeto) {
          router.replace(`/${username}/${updatedProject.slug}/informacoes_do_projeto`);
        }
      }
    } catch (error: any) {
      console.error('Erro na requisição:', error);
      alert(error.message || 'Erro ao atualizar projeto.');
    } finally {
      setIsSaving(false);
    }
  };

  if (projectLoading) {
    return <div className={styles.loading}>Carregando informações do projeto...</div>;
  }

  if (projeto?.papel !== 'adm') {
    return <div className={styles.error}>Acesso restrito a administradores.</div>;
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
              <span className={styles.toggleLabel}>Projeto Ativo / Visível</span>
              <span className={styles.toggleDesc}>
                Se desativado (oculto), o projeto não aparecerá nas listagens públicas.
              </span>
            </div>
            <label className={styles.switch}>
              <input 
                type="checkbox" 
                checked={display}
                onChange={(e) => setDisplay(e.target.checked)}
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
