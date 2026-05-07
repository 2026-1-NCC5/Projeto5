import styles from './GroupControls.module.css';

interface GroupControlsProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (v: 'asc' | 'desc') => void;
}

export function GroupControls({
  searchTerm,
  setSearchTerm,
  sortOrder,
  setSortOrder
}: GroupControlsProps) {
  return (
    <div className={styles.controls}>
      <div className={styles.searchGroup}>
        <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
        <input 
          type="text" 
          placeholder="Buscar por nome do grupo..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.filterGroup}>
        <div className={styles.selectWrapper}>
          <label>Ordem:</label>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as any)}>
            <option value="asc">Nome (Crescente)</option>
            <option value="desc">Nome (Decrescente)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
