'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import EdicaoCard from '@/components/EdicaoCard/EdicaoCard';
import styles from './page.module.css';
import { useProject } from '@/contexts/ProjectContext';
import { useEdicoes } from '@/hooks/useEdicoes';


export default function EdicoesPage() {
  const { username, slug_projeto } = useParams();
  const { papel } = useProject();
  const { edicoes: edicoes, fetchEdicoes, isLoading } = useEdicoes();
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'ativos' | 'encerrados'>('todos');

  useEffect(() => {
    if (username && slug_projeto) {
      fetchEdicoes(username as string, slug_projeto as string);
    }
  }, [username, slug_projeto, fetchEdicoes]);

  // Lógica de filtragem idêntica ao padrão de projetos
  const desafiosFiltrados = (Array.isArray(edicoes) ? edicoes : []).filter((d) => {
    const matchesBusca = d.nome.toLowerCase().includes(busca.toLowerCase());
    
    // Calcula o status em tempo real para o filtro
    const hoje = new Date();
    const estaAtivo = hoje >= new Date(d.dataInicio) && hoje <= new Date(d.dataFim);
    
    const matchesStatus = 
      filtroStatus === 'todos' ? true : 
      filtroStatus === 'ativos' ? estaAtivo : !estaAtivo;

    return matchesBusca && matchesStatus;
  });

  return (
    <main className={styles.container}>
      <header className={styles.headerArea}>
        <div>
          <h1 className={styles.mainTitle}>Edições do Projeto</h1>
          <p className={styles.subTitle}>Gerencie cronogramas e atividades operacionais.</p>
        </div>
        
        {/* Apenas Admins podem criar novos desafios */}
        {papel === 'adm' && (
          <Link 
            href={`/${username}/${slug_projeto}/edicoes/nova_edicao`} 
            className={styles.newProjectBtn}
          >
            + Criar Edição
          </Link>
        )}
      </header>

      {/* Toolbar com Search e Select */}
      <section className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
          <input 
            type="text" 
            placeholder="Buscar edição por nome..." 
            className={styles.searchInput}
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <div className={styles.filterSection}>
          <div className={styles.filterGroup}>
            <label htmlFor="status" className={styles.filterLabel}>STATUS TEMPORAL</label>
            <select 
              id="status"
              className={styles.selectInput}
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value as any)}
            >
              <option value="todos">Todos os Períodos</option>
              <option value="ativos">Ativos (Em andamento)</option>
              <option value="encerrados">Encerrados</option>
            </select>
          </div>
        </div>
      </section>

      <div className={styles.cardGrid}>
        {isLoading ? (
          <p>Carregando edições...</p>
        ) : (
          desafiosFiltrados.map((edicao) => (
            <EdicaoCard key={edicao.id} edicao={edicao} />
          ))
        )}
      </div>

      {desafiosFiltrados.length === 0 && (
        <div className={styles.emptyState}>
          <span className={`material-symbols-outlined ${styles.emptyIcon}`}>folder_off</span>
          <p>Nenhuma edição encontrada para os filtros selecionados.</p>
        </div>
      )}
    </main>
  );
}