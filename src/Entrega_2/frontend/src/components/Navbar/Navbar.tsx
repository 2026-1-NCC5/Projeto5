'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import PerfilBox from '../PerfilBox/PerfilBox';
import { User } from '@/types';

import { useProject } from '@/contexts/ProjectContext';
import { apiFetch } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const { projeto, edicao, turma, user, isLoading: isProjectLoading } = useProject();
  const { logout } = useAuth();
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const pathname = usePathname();
  
  // Referência para o container que envolve o avatar e o box
  const containerRef = useRef<HTMLDivElement>(null);

  // O estado de autenticação agora vem do contexto global
  const isAuthenticated = !!user;

  useEffect(() => {
    // Detectar clique fora do menu de perfil
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsBoxOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Formata o avatar com fallback
  const userAvatar = user?.avatar || `https://ui-avatars.com/api/?name=${user?.nome || 'User'}&background=6366f1&color=fff`;

  const toggleTheme = (theme: 'light' | 'dark') => {
    // Aqui poderíamos chamar uma API para salvar a preferência
    document.documentElement.setAttribute('data-theme', theme);
  };

  const handleLogout = () => {
    setIsBoxOpen(false);
    logout();
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.leftSection}>
        <Link href="/" className={styles.logo}>ScanCount AI</Link>

        {projeto && user && (
          <nav className={styles.breadcrumbs}>
            <span className={styles.breadcrumbSeparator}>/</span>
            <Link href={`/${user.username}/${projeto.slug}`} className={styles.breadcrumbItem}>
              {projeto.nome}
            </Link>

            {edicao && (
              <>
                <span className={styles.breadcrumbSeparator}>/</span>
                <Link href={`/${user.username}/${projeto.slug}/${edicao.slug}`} className={styles.breadcrumbItem}>
                  {edicao.nome}
                </Link>
              </>
            )}

            {turma && (
              <>
                <span className={styles.breadcrumbSeparator}>/</span>
                <Link href={`/${user.username}/${projeto.slug}/${edicao?.slug}/${turma.slug}`} className={`${styles.breadcrumbItem} ${styles.currentPath}`}>
                  {turma.nome}
                </Link>
              </>
            )}
          </nav>
        )}
      </div>

      <div className={styles.navActions}>
        {isAuthenticated ? (
          <div className={styles.authenticatedWrapper} ref={containerRef}>
            <span className={`material-symbols-outlined ${styles.icon}`}>notifications</span>
            
            <div 
              className={styles.avatarTrigger} 
              onClick={() => setIsBoxOpen(!isBoxOpen)}
            >
              <div className={styles.avatarContainer}>
                <img src={userAvatar} alt="User Profile" />
              </div>
            </div>

            {isBoxOpen && (
              <PerfilBox 
                user={user} 
                onThemeChange={toggleTheme}
                onLogout={handleLogout}
              />
            )}
          </div>
        ) : (
          <div className={styles.authButtons}>
            <Link href="/login" className={styles.loginBtn}>Entrar</Link>
            <Link href="/cadastro" className={styles.registerBtn}>Cadastre-se</Link>
          </div>
        )}
      </div>
    </header>
  );
}