import { Turma } from '@/types';
import styles from './StudentRegistrationPanel.module.css';

interface StudentRegistrationPanelProps {
  turmas: Turma[];
}

export function StudentRegistrationPanel({ turmas }: StudentRegistrationPanelProps) {
  return (
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
  );
}
