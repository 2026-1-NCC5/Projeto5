import { useState } from 'react';
import { Aluno } from '@/types';
import styles from './StudentRow.module.css';

interface StudentRowProps {
  aluno: Aluno;
  onUpdate: (id: string | number, data: Partial<Aluno>) => void;
  onDelete: (id: string | number) => void;
}

export function StudentRow({ aluno, onUpdate, onDelete }: StudentRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [editData, setEditData] = useState({
    nome: aluno.nome,
    ra: aluno.ra,
    email: aluno.email,
    grupoNome: aluno.grupoNome || ''
  });

  const handleSave = () => {
    onUpdate(aluno.id!, editData);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <tr className={styles.rowEditing}>
        <td><input value={editData.nome} onChange={e => setEditData({...editData, nome: e.target.value})} className={styles.editInput} /></td>
        <td><input value={editData.ra} onChange={e => setEditData({...editData, ra: e.target.value})} className={styles.editInput} /></td>
        <td><input value={editData.email} onChange={e => setEditData({...editData, email: e.target.value})} className={styles.editInput} /></td>
        <td><input value={editData.grupoNome} onChange={e => setEditData({...editData, grupoNome: e.target.value})} className={styles.editInput} /></td>
        <td>
          <span className={aluno.vinculo ? styles.linked : styles.notLinked}>
            {aluno.vinculo ? 'Sim' : 'Não'}
          </span>
        </td>
        <td className={styles.actionsCell}>
          <button onClick={handleSave} className={styles.saveBtn}>Salvar</button>
          <button onClick={() => setIsEditing(false)} className={styles.cancelBtn}>Cancelar</button>
        </td>
      </tr>
    );
  }

  return (
    <tr className={styles.row}>
      <td>{aluno.nome}</td>
      <td>{aluno.ra}</td>
      <td>{aluno.email}</td>
      <td>{aluno.grupoNome || '-'}</td>
      <td>
        <span className={aluno.vinculo ? styles.linked : styles.notLinked}>
          {aluno.vinculo ? 'Sim' : 'Não'}
        </span>
      </td>
      <td className={styles.actionsCell}>
        <div className={styles.menuContainer}>
          <button className={styles.menuBtn} onClick={() => setShowMenu(!showMenu)}>
            <span className="material-symbols-outlined">more_vert</span>
          </button>
          
          {showMenu && (
            <div className={styles.actionMenu}>
              <button onClick={() => { setIsEditing(true); setShowMenu(false); }}>Editar</button>
              <button onClick={() => { onDelete(aluno.id!); setShowMenu(false); }} className={styles.deleteBtn}>Excluir</button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}
