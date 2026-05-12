'use client';

import Link from 'next/link';
import styles from './PerfilBox.module.css';
import { User } from '@/types';

interface PerfilBoxProps {
  user: User;
  onLogout: () => void;
  onThemeChange: (theme: 'light' | 'dark') => void;
}

export default function PerfilBox({ user, onLogout, onThemeChange }: PerfilBoxProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/perfil" className={styles.avatarLink}>
          <div className={styles.largeAvatar}>
            <img src={user.avatar} alt={user.nome} />
          </div>
        </Link>
        <div className={styles.userInfo}>
          <h3 className={styles.userName}>{user.nome}</h3>
          <p className={styles.userEmail}>{user.email}</p>
          <Link href="/perfil" className={styles.profileLink}>
            Ver meu perfil
          </Link>
        </div>
      </div>

      <div className={styles.themeToggle}>
        <p className={styles.sectionLabel}>Tema</p>
        <div className={styles.toggleButtons}>
          <button 
            onClick={() => onThemeChange('light')}
            className={`${styles.themeBtn} ${user.preferences?.theme === 'light' ? styles.active : ''}`}
          >
            <span className="material-symbols-outlined">light_mode</span>
          </button>
          <button 
            onClick={() => onThemeChange('dark')}
            className={`${styles.themeBtn} ${user.preferences?.theme === 'dark' ? styles.active : ''}`}
          >
            <span className="material-symbols-outlined">dark_mode</span>
          </button>
        </div>
      </div>

      <div className={styles.actions}>
        <Link href="/configuracoes" className={styles.actionBtn}>
          <span className="material-symbols-outlined">settings</span>
          Configurações
        </Link>
        <button onClick={onLogout} className={`${styles.actionBtn} ${styles.logoutBtn}`}>
          <span className="material-symbols-outlined">logout</span>
          Sair
        </button>
      </div>
    </div>
  );
}