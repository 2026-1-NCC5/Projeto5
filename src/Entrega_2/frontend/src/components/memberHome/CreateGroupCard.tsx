'use client';

import React, { useState } from 'react';
import styles from './CreateGroupCard.module.css';
import { Aluno } from '@/types';

interface CreateGroupCardProps {
  alunosSemGrupo: Aluno[];
  onCriarGrupo: (nome: string, convidadosIds: (string | number)[]) => void;
}

export const CreateGroupCard: React.FC<CreateGroupCardProps> = ({ alunosSemGrupo, onCriarGrupo }) => {
  const [nomeGrupo, setNomeGrupo] = useState('');
  const [convidados, setConvidados] = useState<(string | number)[]>([]);

  const handleToggleConvidado = (id: string | number) => {
    setConvidados(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeGrupo.trim()) return;
    onCriarGrupo(nomeGrupo, convidados);
  };

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <span className="material-symbols-outlined">group_add</span>
        <h2>Você ainda não tem um grupo</h2>
        <p>Crie uma nova equipe e convide seus colegas para participar.</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="groupName">Nome do Grupo</label>
          <input 
            id="groupName"
            type="text" 
            placeholder="Ex: Delta Force"
            value={nomeGrupo}
            onChange={(e) => setNomeGrupo(e.target.value)}
            required
          />
        </div>

        <div className={styles.inviteSection}>
          <h3>Convidar Colegas ({convidados.length} selecionados)</h3>
          <div className={styles.userList}>
            {alunosSemGrupo.length === 0 ? (
              <p className={styles.empty}>Todos os alunos da sua turma já possuem um grupo.</p>
            ) : (
              alunosSemGrupo.map(aluno => (
                <div 
                  key={aluno.id} 
                  className={`${styles.userItem} ${convidados.includes(aluno.id!) ? styles.selected : ''}`}
                  onClick={() => handleToggleConvidado(aluno.id!)}
                >
                  <div className={styles.userInfo}>
                    <span className={styles.userName}>{aluno.nome}</span>
                    <span className={styles.userRa}>{aluno.ra}</span>
                  </div>
                  <span className="material-symbols-outlined">
                    {convidados.includes(aluno.id!) ? 'check_circle' : 'add_circle'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <button type="submit" className={styles.submitBtn} disabled={!nomeGrupo.trim()}>
          Criar Grupo e Enviar Convites
        </button>
      </form>
    </section>
  );
};
