import styles from './GroupControls.module.css';

export type GroupSortField = 'nome' | 'membros' | 'peso' | 'valor';

interface GroupControlsProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  sortField: GroupSortField;
  setSortField: (v: GroupSortField) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (v: 'asc' | 'desc') => void;
}

export function GroupControls({
  searchTerm,
  setSearchTerm,
  sortField,
  setSortField,
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
          <label>Ordenar por:</label>
          <select value={sortField} onChange={(e) => setSortField(e.target.value as GroupSortField)}>
            <option value="nome">Nome</option>
            <option value="membros">Qtd. Membros</option>
            <option value="peso">Peso Total</option>
            <option value="valor">Valor Total</option>
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
