'use client';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './Sidebar.module.css';
import { SidebarProjeto } from './SidebarProjeto';
import { SidebarEdicao } from './SidebarEdicao';
import { SidebarTurma } from './SidebarTurma';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const params = useParams();
  const pathname = usePathname();
  
  const slugProjeto = params.slug_projeto as string;
  const slugEdicao = params.slug_edicao as string;
  const slugTurma = params.slug_turma as string;
  const username = params.username as string;

  if (!slugProjeto) return null;

  // Agora a detecção é baseada na subpasta /[slug_edicao]
  const renderEdicao = !!slugEdicao && pathname.includes(`/${slugEdicao}`);
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
          username={username}
          slugProjeto={slugProjeto} 
          slugEdicao={slugEdicao} 
          slugTurma={slugTurma} 
          isCollapsed={isCollapsed} 
        />
      ) : renderEdicao ? (
        <SidebarEdicao 
          username={username}
          slugProjeto={slugProjeto} 
          slugEdicao={slugEdicao} 
          isCollapsed={isCollapsed} 
        />
      ) : (
        <SidebarProjeto 
          username={username}
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