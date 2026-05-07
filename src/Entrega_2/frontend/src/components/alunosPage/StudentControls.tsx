import styles from './StudentControls.module.css';

interface StudentControlsProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  sortField: 'nome' | 'grupoNome';
  setSortField: (v: 'nome' | 'grupoNome') => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (v: 'asc' | 'desc') => void;
}

export function StudentControls({
  searchTerm,
  setSearchTerm,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder
}: StudentControlsProps) {
  return (
    <div className={styles.controls}>
      <div className={styles.searchGroup}>
        <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
        <input 
          type="text" 
          placeholder="Buscar por nome, RA ou grupo..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.filterGroup}>
        <div className={styles.selectWrapper}>
          <label>Ordenar por:</label>
          <select value={sortField} onChange={(e) => setSortField(e.target.value as any)}>
            <option value="nome">Nome</option>
            <option value="grupoNome">Grupo</option>
          </select>
        </div>

        <div className={styles.selectWrapper}>
          <label>Ordem:</label>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as any)}>
            <option value="asc">Crescente</option>
            <option value="desc">Decrescente</option>
          </select>
        </div>
      </div>
    </div>
  );
}
