'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { Turma } from '@/types';
import { useParams } from 'next/navigation';
import { TurmaCard } from '@/components/TurmaCard/TurmaCard';
import { CreateTurmaCard } from '@/components/CreateTurmaCard/CreateTurmaCard';
import { StudentRegistrationPanel } from '@/components/StudentRegistrationPanel/StudentRegistrationPanel';
import { ImportStudentsPanel } from '@/components/ImportStudentsPanel/ImportStudentsPanel';

export default function TurmasPage() {
  const params = useParams();
  const slugProjeto = params.slug_projeto as string;
  const slugDesafio = params.slug_desafio as string;

  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetch('/api/turmas')
      .then((res) => res.json())
      .then((data) => setTurmas(data));
  }, []);

  const handleCreateTurma = async (nome: string) => {
    const response = await fetch('/api/turmas', {
      method: 'POST',
      body: JSON.stringify({ nome }),
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
      const data = await response.json();
      setTurmas([...turmas, data]);
      setIsCreating(false);
    }
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
            slugProjeto={slugProjeto} 
            slugDesafio={slugDesafio} 
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
