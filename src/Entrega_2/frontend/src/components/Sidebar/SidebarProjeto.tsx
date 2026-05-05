'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

interface SidebarProjetoProps {
  slugProjeto: string;
  isCollapsed: boolean;
}

export function SidebarProjeto({ slugProjeto, isCollapsed }: SidebarProjetoProps) {
  const pathname = usePathname();
  
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
    { 
      name: 'Métricas (Dashboard)', 
      icon: 'show_chart', 
      path: `/${slugProjeto}/metricas_do_projeto` 
    },
  ];

  return (
    <nav className={styles.menuList}>
      {menu.map((item) => {
        // Verifica se é a página exata de desafios ou as outras abas[cite: 6]
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