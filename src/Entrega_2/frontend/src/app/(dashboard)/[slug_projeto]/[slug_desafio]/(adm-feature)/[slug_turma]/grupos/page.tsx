'use client';

import { useState, useEffect, useMemo } from 'react';
import { Grupo, Aluno } from '@/types';
import { GroupTable } from '@/components/gruposPage/GroupTable';
import { GroupControls } from '@/components/gruposPage/GroupControls';
import styles from './page.module.css';

export default function GruposPage() {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [totalAlunos, setTotalAlunos] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [resGrupos, resAlunos] = await Promise.all([
        fetch('/api/grupos'),
        fetch('/api/alunos')
      ]);
      const dataGrupos = await resGrupos.json();
      const dataAlunos = await resAlunos.json();
      
      setGrupos(dataGrupos);
      setTotalAlunos(dataAlunos.length);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const alunosEmGrupos = useMemo(() => {
    return grupos.reduce((acc, grupo) => acc + (grupo.alunos ? grupo.alunos.length : 0), 0);
  }, [grupos]);

  const filteredAndSortedGrupos = useMemo(() => {
    let result = [...grupos];

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(g => 
        g.nome.toLowerCase().includes(term)
      );
    }

    // Sort by name
    result.sort((a, b) => {
      const valA = (a.nome || '').toString().toLowerCase();
      const valB = (b.nome || '').toString().toLowerCase();
      
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [grupos, searchTerm, sortOrder]);

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Gestão de Grupos</h1>
          <p className={styles.subtitle}>Visualize e gerencie os grupos da turma.</p>
        </div>
      </header>

      {!isLoading && (
        <div className={styles.statsContainer}>
          <div className={styles.statCard}>
            <span className={styles.statTitle}>Total de Grupos</span>
            <span className={styles.statValue}>{grupos.length}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statTitle}>Alunos em Grupos</span>
            <span className={styles.statValue}>
              {alunosEmGrupos} <span>/ {totalAlunos}</span>
            </span>
          </div>
        </div>
      )}

      <GroupControls 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      {isLoading ? (
        <div className={styles.loading}>Carregando grupos...</div>
      ) : (
        <GroupTable 
          grupos={filteredAndSortedGrupos} 
        />
      )}
    </main>
  );
}
