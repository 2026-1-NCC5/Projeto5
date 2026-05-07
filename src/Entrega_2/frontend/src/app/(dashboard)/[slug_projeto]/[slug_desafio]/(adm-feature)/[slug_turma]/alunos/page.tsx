'use client';

import { useState, useEffect, useMemo } from 'react';
import { Aluno } from '@/types';
import { StudentTable } from '../../../../../../../components/alunosPage/StudentTable';
import { StudentControls } from '../../../../../../../components/alunosPage/StudentControls';
import styles from './page.module.css';

export default function AlunosPage() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'nome' | 'grupoNome'>('nome');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetchAlunos();
  }, []);

  const fetchAlunos = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/alunos');
      const data = await res.json();
      setAlunos(data);
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (id: string | number, data: Partial<Aluno>) => {
    try {
      const res = await fetch(`/api/alunos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const updated = await res.json();
        setAlunos(prev => prev.map(a => a.id === id ? updated : a));
      }
    } catch (error) {
      console.error('Erro ao atualizar aluno:', error);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm('Tem certeza que deseja excluir este aluno?')) return;
    
    try {
      const res = await fetch(`/api/alunos/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAlunos(prev => prev.filter(a => a.id !== id));
      }
    } catch (error) {
      console.error('Erro ao excluir aluno:', error);
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
        (a.grupoNome && a.grupoNome.toLowerCase().includes(term))
      );
    }

    // Sort
    result.sort((a, b) => {
      const valA = (a[sortField] || '').toString().toLowerCase();
      const valB = (b[sortField] || '').toString().toLowerCase();
      
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
