'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import PerfilBox from '../PerfilBox/PerfilBox';
import { User } from '@/types';

import { useProject } from '@/contexts/ProjectContext';

export default function Navbar() {
  const { projeto, desafio, turma } = useProject();
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

    const token = getCookie('token') || 'bypass-token';
    setIsAuthenticated(true); // Forçamos true para bypassar o firewall

    // Sempre tentamos carregar o usuário, mesmo sem token real
    fetch('/api/auth/me')
        .then(res => {
          if (res.status === 401) {
            // Se o servidor retornar 401, removemos os cookies e o estado
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            setIsAuthenticated(false);
            return null;
          }
          if (!res.ok) throw new Error("Erro na resposta do servidor");
          return res.json();
        })
        .then(data => {
          if (data) setUser(data);
        })
        .catch(err => {
          // Só logamos erros reais de rede ou servidor (não 401)
          console.error("Erro ao carregar perfil:", err);
        });

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
    // Remove todos os cookies relacionados à autenticação
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    setIsAuthenticated(false);
    setIsBoxOpen(false);
    window.location.href = '/login';
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.leftSection}>
        <Link href="/" className={styles.logo}>ScanCount AI</Link>

        {projeto && (
          <nav className={styles.breadcrumbs}>
            <span className={styles.breadcrumbSeparator}>/</span>
            <Link href={`/${projeto.slug}`} className={styles.breadcrumbItem}>
              {projeto.nome}
            </Link>

            {desafio && (
              <>
                <span className={styles.breadcrumbSeparator}>/</span>
                <Link href={`/${projeto.slug}/${desafio.slug}`} className={styles.breadcrumbItem}>
                  {desafio.nome}
                </Link>
              </>
            )}

            {turma && (
              <>
                <span className={styles.breadcrumbSeparator}>/</span>
                <Link href={`/${projeto.slug}/${desafio?.slug}/${turma.slug}`} className={`${styles.breadcrumbItem} ${styles.currentPath}`}>
                  {turma.nome}
                </Link>
              </>
            )}
          </nav>
        )}
      </div>

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