import React, { useState, useMemo } from 'react';
import { Item } from '@/types';
import styles from './ItemPermissionManager.module.css';

interface ItemPermissionManagerProps {
  itensPermitidosIds: string[];
  catalogoItens: Item[];
  onToggle: (itemId: string) => void;
  onAddManual: (item: Omit<Item, 'id'>) => void;
}

export function ItemPermissionManager({ 
  itensPermitidosIds, 
  catalogoItens, 
  onToggle,
  onAddManual 
}: ItemPermissionManagerProps) {
  const [query, setQuery] = useState('');
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualItem, setManualItem] = useState<{ nome: string; peso: number; preco: number } & Partial<Item>>({ 
    nome: '', 
    peso: 0, 
    preco: 0 
  });

  const filteredCatalog = useMemo(() => {
    if (!query) return [];
    return catalogoItens.filter(item => 
      item.nome.toLowerCase().includes(query.toLowerCase()) &&
      !itensPermitidosIds.includes(item.id.toString())
    );
  }, [query, catalogoItens, itensPermitidosIds]);

  const selectedItens = useMemo(() => {
    return catalogoItens.filter(item => itensPermitidosIds.includes(item.id.toString()));
  }, [catalogoItens, itensPermitidosIds]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCatalog.length > 0) {
        onToggle(filteredCatalog[0].id.toString());
        setQuery('');
      } else if (query && filteredCatalog.length === 0) {
        setShowManualForm(true);
        setManualItem({ ...manualItem, nome: query });
      }
    }
  };

  const handleCreateManual = (e: React.FormEvent) => {
    e.preventDefault();
    onAddManual({
      ...manualItem,
      comprimento: 0,
      largura: 0
    });
    setShowManualForm(false);
    setManualItem({ nome: '', peso: 0, preco: 0 });
    setQuery('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchWrapper}>
        <div className={styles.inputGroup}>
          <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
          <input 
            type="text" 
            placeholder="Buscar item no catálogo ou digitar novo..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className={styles.searchInput}
          />
        </div>

        {query && (
          <div className={styles.dropdown}>
            {filteredCatalog.length > 0 ? (
              filteredCatalog.map(item => (
                <button 
                  key={item.id} 
                  type="button"
                  className={styles.dropdownItem}
                  onClick={() => {
                    onToggle(item.id.toString());
                    setQuery('');
                  }}
                >
                  <span className={styles.itemName}>{item.nome}</span>
                  <span className={styles.itemMeta}>{item.peso}kg | R$ {item.preco}</span>
                </button>
              ))
            ) : (
              <button 
                type="button" 
                className={styles.createBtn}
                onClick={() => {
                  setShowManualForm(true);
                  setManualItem({ ...manualItem, nome: query });
                }}
              >
                <span className="material-symbols-outlined">add_circle</span>
                Criar novo item: "{query}"
              </button>
            )}
          </div>
        )}
      </div>

      {showManualForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Criar Novo Item Manualmente</h3>
            <form onSubmit={handleCreateManual} className={styles.manualForm}>
              <div className={styles.field}>
                <label>Nome do Item</label>
                <input 
                  type="text" 
                  value={manualItem.nome}
                  onChange={(e) => setManualItem({ ...manualItem, nome: e.target.value })}
                  required
                />
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Peso (kg)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={manualItem.peso}
                    onChange={(e) => setManualItem({ ...manualItem, peso: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label>Preço (R$)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={manualItem.preco}
                    onChange={(e) => setManualItem({ ...manualItem, preco: parseFloat(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowManualForm(false)}>Cancelar</button>
                <button type="submit" className={styles.confirmBtn}>Adicionar ao Projeto</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.selectedList}>
        <h4 className={styles.listTitle}>Itens Selecionados ({selectedItens.length})</h4>
        <div className={styles.tags}>
          {selectedItens.map(item => (
            <div key={item.id} className={styles.tag}>
              <div className={styles.tagInfo}>
                <span className={styles.tagName}>{item.nome}</span>
                <span className={styles.tagMeta}>{item.peso}kg</span>
              </div>
              <button 
                type="button" 
                onClick={() => onToggle(item.id.toString())}
                className={styles.removeBtn}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          ))}
          {selectedItens.length === 0 && (
            <p className={styles.empty}>Nenhum item selecionado. Use a busca acima.</p>
          )}
        </div>
      </div>
    </div>
  );
}
