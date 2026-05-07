import styles from './ImportStudentsPanel.module.css';

export function ImportStudentsPanel() {
  const triggerFileInput = () => {
    document.getElementById('fileInput')?.click();
  };

  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <span className={`material-symbols-outlined ${styles.panelIcon}`}>group_add</span>
        <h2 className={styles.panelTitle}>Importar Alunos</h2>
      </div>
      <div className={styles.dropzone} onClick={triggerFileInput}>
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
  );
}
