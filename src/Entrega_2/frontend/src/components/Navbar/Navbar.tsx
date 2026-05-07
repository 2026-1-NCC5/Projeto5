'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import PerfilBox from '../PerfilBox/PerfilBox';
import { User } from '@/types';

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const pathname = usePathname();
  
  // Referência para o container que envolve o avatar e o box
  const containerRef = useRef<HTMLDivElement>(null);

  // Estado do usuário logado
  const [user, setUser] = useState<User>({
    id: '',
    nome: '',
    email: '',
    avatar: 'https://lh3.googleusercontent.com/a/default-user',
    preferences: { theme: 'dark' }
  });

  useEffect(() => {
    // Função auxiliar para ler cookies de forma limpa
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return undefined;
    };

    const token = getCookie('token');
    setIsAuthenticated(!!token);

    if (token) {
      fetch('/api/auth/me')
        .then(res => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then(data => setUser(data))
        .catch(err => console.error("Erro ao carregar perfil:", err));
    }

    // 2. Função para detectar clique fora
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsBoxOpen(false);
      }
    };

    // Adiciona o evento ao carregar o componente
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup: remove o evento ao desmontar para evitar vazamento de memória
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [pathname]);

  const toggleTheme = (theme: 'light' | 'dark') => {
    setUser({ ...user, preferences: { theme } });
    document.documentElement.setAttribute('data-theme', theme);
  };

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setIsAuthenticated(false);
    setIsBoxOpen(false);
    window.location.href = '/login';
  };

  return (
    <header className={styles.navbar}>
      <Link href="/" className={styles.logo}>ScanCount AI</Link>

      <div className={styles.navActions}>
        {isAuthenticated ? (
          /* Adicionamos a ref no wrapper que contém o trigger e o box */
          <div className={styles.authenticatedWrapper} ref={containerRef}>
            <span className={`material-symbols-outlined ${styles.icon}`}>notifications</span>
            
            <div 
              className={styles.avatarTrigger} 
              onClick={() => setIsBoxOpen(!isBoxOpen)}
            >
              <div className={styles.avatarContainer}>
                <img src={user.avatar} alt="User Profile" />
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