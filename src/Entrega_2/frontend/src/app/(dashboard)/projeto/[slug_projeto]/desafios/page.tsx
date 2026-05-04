'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import DesafioCard from '@/components/DesafioCard/DesafioCard';
import styles from './page.module.css';

export default function DesafiosPage() {
  const { slug_projeto } = useParams();
  const [desafios, setDesafios] = useState([]);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'ativos' | 'encerrados'>('todos');

  useEffect(() => {
    fetch(`/api/projetos/${slug_projeto}/desafios`)
      .then(res => res.json())
      .then(data => setDesafios(data));
  }, [slug_projeto]);

  // Lógica de filtragem idêntica ao padrão de projetos
  const desafiosFiltrados = desafios.filter((d) => {
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
          <h1 className={styles.mainTitle}>Desafios do Projeto</h1>
          <p className={styles.subTitle}>Gerencie cronogramas e atividades operacionais.</p>
        </div>
        {/* Botão para criar novo desafio dentro deste projeto específico[cite: 4, 7] */}
        <Link 
          href={`/projeto/${slug_projeto}/desafios/novo_desafio`} 
          className={styles.newProjectBtn}
        >
          + Criar Desafio
        </Link>
      </header>

      {/* Toolbar com Search e Select[cite: 9, 10] */}
      <section className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
          <input 
            type="text" 
            placeholder="Buscar desafio por nome..." 
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
        {desafiosFiltrados.map((desafio) => (
          <DesafioCard key={desafio.id} desafio={desafio} />
        ))}
      </div>

      {desafiosFiltrados.length === 0 && (
        <div className={styles.emptyState}>
          <span className={`material-symbols-outlined ${styles.emptyIcon}`}>folder_off</span>
          <p>Nenhum desafio encontrado para os filtros selecionados.</p>
        </div>
      )}
    </main>
  );
}