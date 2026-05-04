'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

interface SidebarDesafioProps {
  slugProjeto: string;
  slugDesafio: string;
  isCollapsed: boolean;
}

export function SidebarDesafio({ slugProjeto, slugDesafio, isCollapsed }: SidebarDesafioProps) {
  const pathname = usePathname();
  // Caminho base atualizado para refletir a nova pasta /desafios/[slug_desafio][cite: 4, 5]
  const basePath = `/projeto/${slugProjeto}/desafios/${slugDesafio}`;
  
  const menu = [
    { name: 'Turmas', icon: 'school', path: `${basePath}/turmas` },
    { name: 'Métricas (Dashboard)', icon: 'show_chart', path: `${basePath}/metricas` },
    { name: 'AI Checkout', icon: 'photo_camera', path: `${basePath}/checkout` },
  ];

  return (
    <nav className={styles.menuList}>
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