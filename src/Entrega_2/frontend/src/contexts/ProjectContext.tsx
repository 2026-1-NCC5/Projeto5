'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { Projeto, ProjetoPapel, Desafio, Turma } from '@/types';

interface ProjectContextType {
  projeto: Projeto | null;
  desafio: Desafio | null;
  turma: Turma | null;
  papel: ProjetoPapel | null;
  isLoading: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  
  const slugProjeto = params.slug_projeto as string;
  const slugDesafio = params.slug_desafio as string;
  const slugTurma = params.slug_turma as string;

  const [projeto, setProjeto] = useState<Projeto | null>(null);
  const [desafio, setDesafio] = useState<Desafio | null>(null);
  const [turma, setTurma] = useState<Turma | null>(null);
  const [papel, setPapel] = useState<ProjetoPapel | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slugProjeto) {
      setProjeto(null);
      setDesafio(null);
      setTurma(null);
      setIsLoading(false);
      return;
    }

    const fetchAllDetails = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch Projeto
        const resProj = await fetch('/api/projetos/');
        if (resProj.ok) {
          const projetos: Projeto[] = await resProj.json();
          const currentProject = projetos.find(p => p.slug === slugProjeto);
          
          if (currentProject) {
            setProjeto(currentProject);
            setPapel(currentProject.papel);

            // 2. Fetch Desafio if slug exists
            if (slugDesafio) {
              const resDes = await fetch(`/api/projetos/${slugProjeto}/desafios`);
              if (resDes.ok) {
                const desafios: Desafio[] = await resDes.json();
                const currentDesafio = desafios.find(d => d.slug === slugDesafio);
                setDesafio(currentDesafio || null);

                // 3. Fetch Turma if slug exists
                if (slugTurma) {
                  const resTur = await fetch('/api/turmas');
                  if (resTur.ok) {
                    const turmas: Turma[] = await resTur.json();
                    const currentTurma = turmas.find(t => t.slug === slugTurma);
                    setTurma(currentTurma || null);
                  }
                } else {
                  setTurma(null);
                }
              }
            } else {
              setDesafio(null);
              setTurma(null);
            }
            
            // Lógica de proteção de rotas client-side
            const adminRoutes = [
              '/turmas', 
              '/metricas', 
              '/grupos', 
              '/alunos', 
              '/novo_desafio', 
              '/informacoes', 
              '/informacoes_do_projeto'
            ];
            const memberRoutes = ['/home', '/registrar_coleta'];

            const isTryingAdminRoute = adminRoutes.some(route => pathname.includes(route));
            const isTryingMemberRoute = memberRoutes.some(route => pathname.includes(route));

            if (currentProject.papel === 'membro' && isTryingAdminRoute) {
              console.warn('Acesso negado: Redirecionando membro para home');
              router.replace(`/${slugProjeto}/${slugDesafio || ''}/home`);
            }

            if (currentProject.papel === 'adm' && isTryingMemberRoute) {
              console.warn('Acesso negado: Redirecionando adm para turmas');
              router.replace(`/${slugProjeto}/${slugDesafio || ''}/turmas`);
            }
          }
        }
      } catch (error) {
        console.error('Erro ao identificar detalhes do projeto:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllDetails();
  }, [slugProjeto, slugDesafio, slugTurma, pathname, router]);

  return (
    <ProjectContext.Provider value={{ projeto, desafio, turma, papel, isLoading }}>
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
