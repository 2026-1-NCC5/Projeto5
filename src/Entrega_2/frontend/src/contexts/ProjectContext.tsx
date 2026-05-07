'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { Projeto, ProjetoPapel } from '@/types';

interface ProjectContextType {
  projeto: Projeto | null;
  papel: ProjetoPapel | null;
  isLoading: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const slugProjeto = params.slug_projeto as string;

  const [projeto, setProjeto] = useState<Projeto | null>(null);
  const [papel, setPapel] = useState<ProjetoPapel | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slugProjeto) {
      setIsLoading(false);
      return;
    }

    const fetchProjectDetails = async () => {
      setIsLoading(true);
      try {
        // Buscamos a lista de projetos e filtramos pelo slug atual
        // Em um cenário real, você teria um endpoint GET /api/projetos/:slug
        const res = await fetch('/api/projetos/');
        if (res.ok) {
          const projetos: Projeto[] = await res.json();
          const currentProject = projetos.find(p => p.slug === slugProjeto);
          
          if (currentProject) {
            setProjeto(currentProject);
            setPapel(currentProject.papel);
            
            // Lógica de proteção de rotas client-side
            const adminRoutes = ['/turmas', '/metricas', '/grupos', '/alunos', '/novo_desafio'];
            const memberRoutes = ['/home', '/registrar_coleta'];

            const isTryingAdminRoute = adminRoutes.some(route => pathname.includes(route));
            const isTryingMemberRoute = memberRoutes.some(route => pathname.includes(route));

            if (currentProject.papel === 'membro' && isTryingAdminRoute) {
              console.warn('Acesso negado: Redirecionando membro para home');
              router.replace(`/${slugProjeto}/${params.slug_desafio || ''}/home`);
            }

            if (currentProject.papel === 'adm' && isTryingMemberRoute) {
              console.warn('Acesso negado: Redirecionando adm para turmas');
              router.replace(`/${slugProjeto}/${params.slug_desafio || ''}/turmas`);
            }
          }
        }
      } catch (error) {
        console.error('Erro ao identificar papel no projeto:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectDetails();
  }, [slugProjeto, pathname, router]);

  return (
    <ProjectContext.Provider value={{ projeto, papel, isLoading }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject deve ser usado dentro de um ProjectProvider');
  }
  return context;
}
