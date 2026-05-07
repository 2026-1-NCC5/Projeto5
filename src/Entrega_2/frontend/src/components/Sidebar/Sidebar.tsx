'use client';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './Sidebar.module.css';
import { SidebarProjeto } from './SidebarProjeto';
import { SidebarDesafio } from './SidebarDesafio';
import { SidebarTurma } from './SidebarTurma';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const params = useParams();
  const pathname = usePathname();
  
  const slugProjeto = params.slug_projeto as string;
  const slugDesafio = params.slug_desafio as string;
  const slugTurma = params.slug_turma as string;

  if (!slugProjeto) return null;

  // Agora a detecção é baseada na subpasta /desafios/[slug_desafio]
  const renderDesafio = !!slugDesafio && pathname.includes(`/${slugDesafio}`);
  const renderTurma = !!slugTurma && pathname.includes(`/${slugTurma}`);

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <button className={styles.collapseBtn} onClick={onToggle}>
        <span className="material-symbols-outlined">
          {isCollapsed ? 'split_scene_left' : 'split_scene_right'}
        </span>
      </button>

      <div className={styles.tenantHeader}></div>
      
      {renderTurma ? (
        <SidebarTurma 
          slugProjeto={slugProjeto} 
          slugDesafio={slugDesafio} 
          slugTurma={slugTurma} 
          isCollapsed={isCollapsed} 
        />
      ) : renderDesafio ? (
        <SidebarDesafio 
          slugProjeto={slugProjeto} 
          slugDesafio={slugDesafio} 
          isCollapsed={isCollapsed} 
        />
      ) : (
        <SidebarProjeto 
          slugProjeto={slugProjeto} 
          isCollapsed={isCollapsed} 
        />
      )}

      <div className={styles.footer}>
        <div className={styles.avatarContainer}>
          <img src="https://lh3.googleusercontent.com/a/default-user" alt="User" />
        </div>
        {!isCollapsed && (
          <Link href="/perfil" className={styles.settingsIcon}>
            <span className="material-symbols-outlined">settings</span>
          </Link>
        )}
      </div>
    </aside>
  );
}