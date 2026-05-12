'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { useParams } from 'next/navigation';
import { TurmaCard } from '@/components/TurmaCard/TurmaCard';
import { CreateTurmaCard } from '@/components/CreateTurmaCard/CreateTurmaCard';
import { StudentRegistrationPanel } from '@/components/StudentRegistrationPanel/StudentRegistrationPanel';
import { ImportStudentsPanel } from '@/components/ImportStudentsPanel/ImportStudentsPanel';

import { useTurmas } from '@/hooks/useTurmas';

export default function TurmasPage() {
  const params = useParams();
  const username = params.username as string;
  const slugProjeto = params.slug_projeto as string;
  const slugEdicao = params.slug_edicao as string;

  const { turmas, fetchTurmas, addTurma } = useTurmas();
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchTurmas(username, slugProjeto, slugEdicao);
  }, [fetchTurmas, username, slugProjeto, slugEdicao]);

  const handleCreateTurma = async (nome: string) => {
    await addTurma(username, slugProjeto, slugEdicao, { nome });
    setIsCreating(false);
  };

  return (
    <main className={styles.container}>
      <header className={styles.headerArea}>
        <div>
          <h1 className={styles.mainTitle}>Gestão de Turmas</h1>
          <p className={styles.subTitle}>Controle de turmas e alunos.</p>
        </div>
      </header>

      <section className={styles.turmasScrollArea}>
        {turmas.map((turma) => (
          <TurmaCard 
            key={turma.id} 
            turma={turma} 
            username={username}
            slugProjeto={slugProjeto} 
            slugEdicao={slugEdicao} 
          />
        ))}

        <CreateTurmaCard 
          isCreating={isCreating} 
          setIsCreating={setIsCreating} 
          onCreate={handleCreateTurma} 
        />
      </section>

      <div className={styles.managementGrid}>
        <StudentRegistrationPanel turmas={turmas} />
        <ImportStudentsPanel />
      </div>
    </main>
  );
}
