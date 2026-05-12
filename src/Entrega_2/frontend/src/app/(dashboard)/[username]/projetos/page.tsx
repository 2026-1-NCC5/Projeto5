'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link'; 
import { useParams } from 'next/navigation';
import styles from './page.module.css';
import ProjetoCard from '@/components/ProjetoCard/ProjetoCard';
import { Projeto } from '@/types';
import { useProjetos } from '@/hooks/useProjetos';

export default function ProjetosPage() {
  const { username } = useParams();
  const { projetos, fetchProjetos, isLoading, error } = useProjetos();
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'ativos' | 'inativos'>('todos');
  const [filtroPapel, setFiltroPapel] = useState<'todos' | 'adm' | 'membro'>('todos');

  useEffect(() => {
    if (username) {
      fetchProjetos(username as string);
    }
  }, [username, fetchProjetos]);

  const projetosFiltrados = (Array.isArray(projetos) ? projetos : []).filter((p) => {
    const matchesBusca = p.nome.toLowerCase().includes(busca.toLowerCase());
    const matchesStatus = 
      filtroStatus === 'todos' ? true : 
      filtroStatus === 'ativos' ? p.status === 'ativo' : p.status !== 'ativo';
    const matchesPapel = 
      filtroPapel === 'todos' ? true : p.papel === filtroPapel;

    return matchesBusca && matchesStatus && matchesPapel;
  });

  return (
    <main className={styles.container}>
      <header className={styles.headerArea}>
        <div>
          <h1 className={styles.mainTitle}>Seus Projetos</h1>
          <p className={styles.subTitle}>Gerencie suas organizações e permissões de acesso.</p>
        </div>
        
        {/* Link adicionado aqui */}
        <Link href={`/${username}/projetos/novo`} className={styles.newProjectBtn}>
          + Novo Projeto
        </Link>
      </header>

      <section className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
          <input 
            type="text" 
            placeholder="Buscar por nome..." 
            className={styles.searchInput}
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <div className={styles.filterSection}>
          {/* Filtro de Status */}
          <div className={styles.filterGroup}>
            <label htmlFor="status" className={styles.filterLabel}>STATUS</label>
            <select 
              id="status"
              className={styles.selectInput}
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value as any)}
            >
              <option value="todos">Todos</option>
              <option value="ativos">Ativos</option>
              <option value="inativos">Inativos</option>
            </select>
          </div>

          {/* Filtro de Papel */}
          <div className={styles.filterGroup}>
            <label htmlFor="papel" className={styles.filterLabel}>PAPEL</label>
            <select 
              id="papel"
              className={styles.selectInput}
              value={filtroPapel}
              onChange={(e) => setFiltroPapel(e.target.value as any)}
            >
              <option value="todos">Todos os Papéis</option>
              <option value="adm">Administrador</option>
              <option value="membro">Membro</option>
            </select>
          </div>
        </div>
      </section>

      <div className={styles.cardGrid}>
        {isLoading ? (
          <p>Carregando projetos...</p>
        ) : error ? (
          <div className={styles.errorArea}>
            <span className="material-symbols-outlined">error</span>
            <p>{error}</p>
          </div>
        ) : projetosFiltrados.length > 0 ? (
          projetosFiltrados.map((projeto) => (
            <ProjetoCard key={projeto.id} projeto={projeto} />
          ))
        ) : (
          <p>Nenhum projeto encontrado.</p>
        )}
      </div>
    </main>
  );
}