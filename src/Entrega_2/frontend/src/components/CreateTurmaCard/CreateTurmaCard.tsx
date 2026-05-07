import { useState } from 'react';
import styles from './CreateTurmaCard.module.css';

interface CreateTurmaCardProps {
  isCreating: boolean;
  setIsCreating: (v: boolean) => void;
  onCreate: (name: string) => void;
}

export function CreateTurmaCard({ isCreating, setIsCreating, onCreate }: CreateTurmaCardProps) {
  const [novaTurmaNome, setNovaTurmaNome] = useState('');

  const handleCreate = () => {
    if (novaTurmaNome.trim()) {
      onCreate(novaTurmaNome);
      setNovaTurmaNome('');
    }
  };

  if (!isCreating) {
    return (
      <button className={styles.addTurmaInline} onClick={() => setIsCreating(true)}>
        <span className="material-symbols-outlined">add</span>
      </button>
    );
  }

  return (
    <div className={`${styles.turmaCard} ${styles.creatingCard}`}>
      <span className={styles.cardCodigo}>NOVA TURMA</span>
      <input 
        autoFocus
        className={styles.inputField}
        placeholder="Nome da turma..."
        value={novaTurmaNome}
        onChange={(e) => setNovaTurmaNome(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
      />
      <div className={styles.creatingActions}>
        <button onClick={handleCreate} className={styles.primaryBtn}>Criar</button>
        <button onClick={() => setIsCreating(false)} className={styles.cancelBtn}>Cancelar</button>
      </div>
    </div>
  );
}
