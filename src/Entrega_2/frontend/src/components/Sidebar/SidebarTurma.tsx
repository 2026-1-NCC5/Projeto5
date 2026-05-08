'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

interface SidebarTurmaProps {
  slugProjeto: string;
  slugDesafio: string;
  slugTurma: string;
  isCollapsed: boolean;
}

export function SidebarTurma({ slugProjeto, slugDesafio, slugTurma, isCollapsed }: SidebarTurmaProps) {
  const pathname = usePathname();
  const basePath = `/${slugProjeto}/${slugDesafio}/${slugTurma}`;
  
  const menu = [
    { name: 'Alunos', icon: 'group', path: `${basePath}/alunos` },
    { name: 'Grupos', icon: 'Groups', path: `${basePath}/grupos` },
  ];

  return (
    <nav className={styles.menuList}>
      <Link href={`/${slugProjeto}/${slugDesafio}`} className={styles.backLink}>
        <span className="material-symbols-outlined">arrow_back</span>
        {!isCollapsed && <span>Voltar para Edição</span>}
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