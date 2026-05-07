'use client';

import { useState } from 'react';
import { usePathname, useParams } from 'next/navigation';
import './globals.css';
import styles from './layout.module.css';
import Sidebar from '@/components/Sidebar/Sidebar';
import Navbar from '@/components/Navbar/Navbar';
import { ProjectProvider } from '@/contexts/ProjectContext';

// Inicialização do MSW para ambiente de desenvolvimento[cite: 1, 5]
if (process.env.NODE_ENV === 'development') {
  if (typeof window !== 'undefined') {
    const { worker } = require('@/mocks/browser');
    worker.start({
      onUnhandledRequest: 'bypass',
    });
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // A Sidebar aparece sempre que houver um slug_projeto nos parâmetros da URL
  // Isso inclui as páginas de informações, métricas e todos os desafios.
  const showSidebar = !!params.slug_projeto;

  return (
    <html lang="pt-br" className="dark">
      <head>
        {/* Importação essencial para os ícones funcionarem */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body>
        <ProjectProvider>
          <div className={styles.wrapper}>
            <Navbar />
            
            <div className={styles.container}>
              {showSidebar && (
                <Sidebar 
                  isCollapsed={isSidebarCollapsed} 
                  onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
                />
              )}
              
              <main className={`
                ${styles.content} 
                ${showSidebar ? (isSidebarCollapsed ? styles.withSidebarCollapsed : styles.withSidebarOpen) : ''}
              `}>
                {children}
              </main>
            </div>
          </div>
        </ProjectProvider>
      </body>
    </html>
  );
}