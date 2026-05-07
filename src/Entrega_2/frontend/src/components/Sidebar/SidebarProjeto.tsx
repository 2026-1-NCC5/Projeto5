'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';
import { useProject } from '@/contexts/ProjectContext';

interface SidebarProjetoProps {
  slugProjeto: string;
  isCollapsed: boolean;
}

export function SidebarProjeto({ slugProjeto, isCollapsed }: SidebarProjetoProps) {
  const pathname = usePathname();
  const { papel } = useProject();
  
  const menu = [
    { 
      name: 'Desafios', 
      icon: 'format_list_bulleted', 
      path: `/${slugProjeto}` 
    },
    { 
      name: 'Informações', 
      icon: 'info', 
      path: `/${slugProjeto}/informacoes_do_projeto` 
    },
  ];

  // Adiciona Métricas apenas se for ADM
  if (papel === 'adm') {
    menu.push({ 
      name: 'Métricas (Dashboard)', 
      icon: 'show_chart', 
      path: `/${slugProjeto}/metricas_do_projeto` 
    });
  }

  return (
    <nav className={styles.menuList}>
      {menu.map((item) => {
        const isActive = pathname === item.path;
        return (
          <Link 
            key={item.name} 
            href={item.path} 
            className={`${styles.menuItem} ${isActive ? styles.menuItemActive : ''}`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            {!isCollapsed && <span>{item.name}</span>}
          </Link>
        );
      })}
    </nav>
  );
}