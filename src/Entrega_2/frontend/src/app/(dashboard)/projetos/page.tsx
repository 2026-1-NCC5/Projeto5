'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link'; 
import styles from './page.module.css';
import ProjetoCard from '@/components/ProjetoCard/ProjetoCard';
import {Projeto} from '@/types';

export default function ProjetosPage() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'ativos' | 'inativos'>('todos');
  const [filtroPapel, setFiltroPapel] = useState<'todos' | 'adm' | 'membro'>('todos');

  useEffect(() => {
    fetch('https://api.scancount.com/projetos/')
      .then((res) => res.json())
      .then((data) => setProjetos(data));
  }, []);

  const projetosFiltrados = projetos.filter((p) => {
    const matchesBusca = p.nome.toLowerCase().includes(busca.toLowerCase());
    const matchesStatus = 
      filtroStatus === 'todos' ? true : 
      filtroStatus === 'ativos' ? p.ativo : !p.ativo;
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
        <Link href="/projetos/novo" className={styles.newProjectBtn}>
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
        {projetosFiltrados.map((projeto) => (
          <ProjetoCard key={projeto.id} projeto={projeto} />
        ))}
      </div>
    </main>
  );
}