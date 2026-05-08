import React, { useState } from 'react';
import styles from './AdminListManager.module.css';

interface AdminListManagerProps {
  admins: string[];
  onUpdate: (newAdmins: string[]) => void;
}

export function AdminListManager({ admins, onUpdate }: AdminListManagerProps) {
  const [newAdmin, setNewAdmin] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAdmin && !admins.includes(newAdmin)) {
      onUpdate([...admins, newAdmin]);
      setNewAdmin('');
    }
  };

  const handleRemove = (email: string) => {
    onUpdate(admins.filter(a => a !== email));
  };

  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {admins.map(email => (
          <li key={email} className={styles.item}>
            <span>{email}</span>
            <button 
              type="button" 
              onClick={() => handleRemove(email)}
              className={styles.removeBtn}
              title="Remover Administrador"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </li>
        ))}
      </ul>
      
      <form onSubmit={handleAdd} className={styles.addForm}>
        <input 
          type="email" 
          placeholder="E-mail do novo administrador..." 
          value={newAdmin}
          onChange={(e) => setNewAdmin(e.target.value)}
          className={styles.input}
        />
        <button type="submit" className={styles.addBtn} disabled={!newAdmin}>
          Adicionar
        </button>
      </form>
    </div>
  );
}
