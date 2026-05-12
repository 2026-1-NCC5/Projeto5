'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';

import { GroupTable } from '@/components/gruposPage/GroupTable';
import { GroupControls, GroupSortField } from '@/components/gruposPage/GroupControls';
import { StudentsWithoutGroupTable } from '@/components/gruposPage/StudentsWithoutGroupTable';
import styles from './page.module.css';

import { useGrupos } from '@/hooks/useGrupos';
import { useAlunos } from '@/hooks/useAlunos';

export default function GruposPage() {
  const { username, slug_projeto, slug_edicao, slug_turma } = useParams();
  const { grupos, fetchGrupos, isLoading: isLoadingGrupos } = useGrupos();
  const { alunos: allAlunos, fetchAlunos, isLoading: isLoadingAlunos } = useAlunos();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<GroupSortField>('nome');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const isLoading = isLoadingGrupos || isLoadingAlunos;

  useEffect(() => {
    fetchGrupos(username as string, slug_projeto as string, slug_edicao as string, slug_turma as string);
    fetchAlunos(username as string, slug_projeto as string, slug_edicao as string, slug_turma as string);
  }, [fetchGrupos, fetchAlunos, username, slug_projeto, slug_edicao, slug_turma]);

  const alunosEmGruposCount = useMemo(() => {
    return grupos.reduce((acc, grupo) => acc + (grupo.alunos ? grupo.alunos.length : 0), 0);
  }, [grupos]);

  const alunosSemGrupo = useMemo(() => {
    // Pegamos os IDs de todos os alunos que estão em algum grupo
    const idsAlunosEmGrupos = new Set(
      grupos.flatMap(g => g.alunos ? g.alunos.map(a => a.id) : [])
    );
    // Filtramos da lista total aqueles que NÃO estão nesse Set
    return allAlunos.filter(a => !idsAlunosEmGrupos.has(a.id));
  }, [grupos, allAlunos]);

  const filteredAndSortedGrupos = useMemo(() => {
    let result = [...grupos];

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(g => 
        g.nome.toLowerCase().includes(term)
      );
    }

    // Sort
    result.sort((a, b) => {
      let valA: string | number = '';
      let valB: string | number = '';

      if (sortField === 'nome') {
        valA = (a.nome || '').toString().toLowerCase();
        valB = (b.nome || '').toString().toLowerCase();
      } else if (sortField === 'membros') {
        valA = a.alunos ? a.alunos.length : 0;
        valB = b.alunos ? b.alunos.length : 0;
      } else if (sortField === 'peso') {
        valA = a.pesoTotal || 0;
        valB = b.pesoTotal || 0;
      } else if (sortField === 'valor') {
        valA = a.precoTotal || 0;
        valB = b.precoTotal || 0;
      }
      
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [grupos, searchTerm, sortField, sortOrder]);

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
              {alunosEmGruposCount} <span>/ {allAlunos.length}</span>
            </span>
          </div>
        </div>
      )}

      <GroupControls 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortField={sortField}
        setSortField={setSortField}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      {isLoading ? (
        <div className={styles.loading}>Carregando grupos...</div>
      ) : (
        <div className={styles.tablesContainer}>
          <section>
            <GroupTable 
              grupos={filteredAndSortedGrupos} 
            />
          </section>
          
          {alunosSemGrupo.length > 0 && (
            <StudentsWithoutGroupTable 
              alunos={alunosSemGrupo} 
            />
          )}
        </div>
      )}
    </main>
  );
}
