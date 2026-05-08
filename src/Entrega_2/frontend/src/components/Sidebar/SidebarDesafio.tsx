'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

interface SidebarDesafioProps {
  slugProjeto: string;
  slugDesafio: string;
  isCollapsed: boolean;
}

import { useProject } from '@/contexts/ProjectContext';

export function SidebarDesafio({ slugProjeto, slugDesafio, isCollapsed }: SidebarDesafioProps) {
  const pathname = usePathname();
  const { papel } = useProject();
  const basePath = `/${slugProjeto}/${slugDesafio}`;
  
  const menu = [];

  if (papel === 'adm') {
    menu.push(
      { name: 'Turmas', icon: 'school', path: `${basePath}/turmas` },
      { name: 'Métricas (Dashboard)', icon: 'show_chart', path: `${basePath}/metricas` },
      { name: 'Informações', icon: 'info', path: `${basePath}/informacoes` }
    );
  } else {
    menu.push(
      { name: 'Home', icon: 'home', path: `${basePath}/home` },
      { name: 'Registrar Coleta', icon: 'photo_camera', path: `${basePath}/registrar_coleta` }
    );
  }

  // AI Checkout disponível para todos
  menu.push({ name: 'AI Checkout', icon: 'camera', path: `${basePath}/checkout` });

  return (
    <nav className={styles.menuList}>
      <Link href={`/${slugProjeto}`} className={styles.backLink}>
        <span className="material-symbols-outlined">arrow_back</span>
        {!isCollapsed && <span>Voltar para Projeto</span>}
      </Link>
      
      {menu.map((item) => (
        <Link 
          key={item.name} 
          href={item.path} 
          className={`${styles.menuItem} ${pathname.startsWith(item.path) ? styles.menuItemActive : ''}`}
        >
          <span className="material-symbols-outlined">{item.icon}</span>
          {!isCollapsed && <span>{item.name}</span>}
        </Link>
      ))}
    </nav>
  );
}