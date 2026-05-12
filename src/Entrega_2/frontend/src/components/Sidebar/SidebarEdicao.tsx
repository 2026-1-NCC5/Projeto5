'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';
import { useProject } from '@/contexts/ProjectContext';

interface SidebarEdicaoProps {
  username: string;
  slugProjeto: string;
  slugEdicao: string;
  isCollapsed: boolean;
}

export function SidebarEdicao({ username, slugProjeto, slugEdicao, isCollapsed }: SidebarEdicaoProps) {
  const pathname = usePathname();
  const { papel } = useProject();
  const basePath = `/${username}/${slugProjeto}/${slugEdicao}`;
  
  const menu = [];

  if (papel === 'adm') {
    menu.push(
      { name: 'Turmas', icon: 'school', path: `${basePath}/turmas` },
      { name: 'Métricas (Dashboard)', icon: 'show_chart', path: `${basePath}/metricas` },
      { name: 'AI Checkout', icon: 'camera', path: `${basePath}/checkout` },
      { name: 'Informações', icon: 'info', path: `${basePath}/informacoes` }
    );
  } else {
    menu.push(
      { name: 'Home', icon: 'home', path: `${basePath}/home` },
      { name: 'Registrar Coleta', icon: 'photo_camera', path: `${basePath}/registrar_coleta` }
    );
  }

  return (
    <nav className={styles.menuList}>
      <Link href={`/${username}/${slugProjeto}/edicoes`} className={styles.backLink}>
        <span className="material-symbols-outlined">arrow_back</span>
        {!isCollapsed && <span>Voltar para Edições</span>}
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
