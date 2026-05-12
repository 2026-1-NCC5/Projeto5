'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';

import { Aluno } from '@/types';
import { StudentTable } from '@/components/alunosPage/StudentTable';
import { StudentControls } from '@/components/alunosPage/StudentControls';
import styles from './page.module.css';
import { useAlunos } from '@/hooks/useAlunos';

export default function AlunosPage() {
  const { username, slug_projeto, slug_edicao, slug_turma } = useParams();
  const { alunos, isLoading, fetchAlunos, updateAluno, deleteAluno } = useAlunos();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'nome' | 'grupo'>('nome');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetchAlunos(username as string, slug_projeto as string, slug_edicao as string, slug_turma as string);
  }, [fetchAlunos, username, slug_projeto, slug_edicao, slug_turma]);

  const handleUpdate = async (id: string | number, data: Partial<Aluno>) => {
    await updateAluno(username as string, slug_projeto as string, slug_edicao as string, slug_turma as string, id, data);
  };

  const handleDelete = async (id: string | number) => {
    if (confirm('Tem certeza que deseja excluir este aluno?')) {
      await deleteAluno(username as string, slug_projeto as string, slug_edicao as string, slug_turma as string, id);
    }
  };

  const filteredAndSortedAlunos = useMemo(() => {
    let result = [...alunos];

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(a => 
        a.nome.toLowerCase().includes(term) || 
        a.ra.includes(term) || 
        (a.grupo?.nome && a.grupo.nome.toLowerCase().includes(term))
      );
    }

    // Sort
    result.sort((a, b) => {
      let valA: string;
      let valB: string;

      if (sortField === 'grupo') {
        valA = (a.grupo?.nome || '').toLowerCase();
        valB = (b.grupo?.nome || '').toLowerCase();
      } else {
        valA = (a[sortField] || '').toString().toLowerCase();
        valB = (b[sortField] || '').toString().toLowerCase();
      }
      
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [alunos, searchTerm, sortField, sortOrder]);

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Gestão de Alunos</h1>
          <p className={styles.subtitle}>Visualize e gerencie os alunos pré-cadastrados na turma.</p>
        </div>
      </header>

      <StudentControls 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortField={sortField}
        setSortField={setSortField}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      {isLoading ? (
        <div className={styles.loading}>Carregando alunos...</div>
      ) : (
        <StudentTable 
          alunos={filteredAndSortedAlunos} 
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </main>
  );
}
