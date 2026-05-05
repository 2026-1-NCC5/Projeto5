'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { Turma } from '@/types';

export default function TurmasPage() {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [novaTurmaNome, setNovaTurmaNome] = useState('');

  useEffect(() => {
    fetch('/turmas')
      .then((res) => res.json())
      .then((data) => setTurmas(data));
  }, []);

  const handleCreateTurma = async () => {
    if (!novaTurmaNome.trim()) return;
    const response = await fetch('/turmas', {
      method: 'POST',
      body: JSON.stringify({ nome: novaTurmaNome }),
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
      const data = await response.json();
      setTurmas([...turmas, data]);
      setIsCreating(false);
      setNovaTurmaNome('');
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
          <div key={turma.id} className={styles.turmaCard}>
            <span className={styles.cardCodigo}>{turma.slug}</span>
            <h3 className={styles.cardTitle}>{turma.nome}</h3>
            <p className={styles.cardStats}>{turma.quantidade} alunos inscritos</p>
          </div>
        ))}

        {isCreating ? (
          <div className={`${styles.turmaCard} ${styles.creatingCard}`}>
            <span className={styles.cardCodigo}>NOVA TURMA</span>
            <input 
              autoFocus
              className={styles.inputField}
              placeholder="Nome da turma..."
              value={novaTurmaNome}
              onChange={(e) => setNovaTurmaNome(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateTurma()}
            />
            <div className={styles.creatingActions}>
              <button onClick={handleCreateTurma} className={styles.primaryBtn}>Criar</button>
              <button onClick={() => setIsCreating(false)} className={styles.cancelBtn}>Cancelar</button>
            </div>
          </div>
        ) : (
          <button className={styles.addTurmaInline} onClick={() => setIsCreating(true)}>
            <span className="material-symbols-outlined">add</span>
          </button>
        )}
      </section>

      <div className={styles.managementGrid}>
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={`material-symbols-outlined ${styles.panelIcon}`}>person_add</span>
            <h2 className={styles.panelTitle}>Pré-cadastro Individual</h2>
          </div>
          <form className={styles.formStacked}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Nome do Aluno</label>
              <input type="text" className={styles.inputField} placeholder="Ex: João Silva" />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>RA / Registro</label>
              <input type="text" className={styles.inputField} placeholder="000000" />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>E-mail</label>
              <input type="email" className={styles.inputField} placeholder="aluno@fecap.br" />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Turma</label>
              <select className={styles.inputField}>
                <option value="">Selecione...</option>
                {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
              </select>
            </div>
            <button type="submit" className={styles.primaryBtn}>Cadastrar Aluno</button>
          </form>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={`material-symbols-outlined ${styles.panelIcon}`}>group_add</span>
            <h2 className={styles.panelTitle}>Importar Alunos</h2>
          </div>
          <div className={styles.dropzone} onClick={() => document.getElementById('fileInput')?.click()}>
            <div className={styles.uploadIconCircle}>
              <span className="material-symbols-outlined">upload_file</span>
            </div>
            <h3 className={styles.panelTitle}>Arraste seu CSV e EXCEL aqui</h3>
            <p className={styles.cardStats}>Ou clique para selecionar arquivos</p>
            <input id="fileInput" type="file" accept=".csv, .xlsx" hidden />
          </div>
          <div className={styles.infoBox}>
            <span className={`material-symbols-outlined ${styles.infoIcon}`}>info</span>
            <p className={styles.infoText}>
              Colunas obrigatórias: <b>nome, email, ra, turma</b>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}