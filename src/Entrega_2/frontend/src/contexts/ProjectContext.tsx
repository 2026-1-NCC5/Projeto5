'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { Projeto, ProjetoPapel, Edicao, Turma } from '@/types';
import ResourceNotFound from '@/components/ResourceNotFound/ResourceNotFound';
import { apiFetch } from '@/services/api';

interface ProjectContextType {
  projeto: Projeto | null;
  edicao: Edicao | null;
  turma: Turma | null;
  papel: ProjetoPapel | null;
  userUsername: string | null;
  user: any | null;
  isLoading: boolean;
  error: { status: number; message: string; actionPath?: string; actionText?: string } | null;
  refreshUser: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  
  const slugProjeto = params.slug_projeto as string;
  const slugEdicao = params.slug_edicao as string;
  const slugTurma = params.slug_turma as string;
  const username = params.username as string;

  const [projeto, setProjeto] = useState<Projeto | null>(null);
  const [edicao, setEdicao] = useState<Edicao | null>(null);
  const [turma, setTurma] = useState<Turma | null>(null);
  const [papel, setPapel] = useState<ProjetoPapel | null>(null);
  const [userUsername, setUserUsername] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<{ status: number; message: string; actionPath?: string; actionText?: string } | null>(null);

  useEffect(() => {
    const identifyUser = async () => {
      try {
        const resMe = await apiFetch('/auth/me');
        if (resMe.ok && resMe.headers.get('content-type')?.includes('application/json')) {
          const userData = await resMe.json();
          setUserUsername(userData.username);
          setUser(userData);
        }
      } catch (err) {
        console.error("Erro ao identificar usuário:", err);
      } finally {
        setUserLoaded(true);
      }
    };
    identifyUser();
  }, []);

  useEffect(() => {
    const fetchAllDetails = async () => {
      if (!username) {
        setIsLoading(false);
        return; 
      }
      setIsLoading(true);
      setError(null);
      try {
        let realUsername = userUsername;

        // 1. Fetch Projeto
        const resProj = await apiFetch(`${username}/projetos/`);
        
        if (resProj.status === 403) {
          setError({ 
            status: 403, 
            message: "Acesso Negado: Você não tem permissão para acessar este espaço.",
            actionPath: `/${realUsername || username}/projetos`,
            actionText: "Ir para meu Painel"
          });
          return;
        }

        if (!slugProjeto) {
          setProjeto(null);
          setPapel(null);
          setEdicao(null);
          setTurma(null);
          return;
        }
        
        if (resProj.status === 404) {
          setError({ 
            status: 404, 
            message: "Projeto não encontrado.",
            actionPath: `/${username}/projetos`,
            actionText: "Voltar para Projetos"
          });
          return;
        }

        if (resProj.ok && resProj.headers.get('content-type')?.includes('application/json')) {
          const projetos: Projeto[] = await resProj.json();
          const currentProject = projetos.find(p => p.slug === slugProjeto);
          
          if (slugProjeto && !currentProject) {
            console.error(`Projeto [${slugProjeto}] não encontrado para o usuário [${username}]`);
            setError({ 
              status: 404, 
              message: "Projeto não encontrado.",
              actionPath: `/${username}/projetos`,
              actionText: "Voltar para Projetos"
            });
            return;
          }
          
          if (currentProject) {
            console.log(`[ProjectContext] Projeto encontrado: ${currentProject.slug}, Papel: ${currentProject.papel}`);
            setProjeto(currentProject);
            setPapel(currentProject.papel || 'membro');

            // 2. Fetch Edição if slug exists
            if (slugEdicao) {
              const resDes = await apiFetch(`${username}/${slugProjeto}/edicoes/`);
              if (resDes.ok && resDes.headers.get('content-type')?.includes('application/json')) {
                const edicoes: Edicao[] = await resDes.json();
                const currentEdicao = edicoes.find(e => e.slug === slugEdicao);
                
                if (slugEdicao && !currentEdicao) {
                  console.error(`Edição [${slugEdicao}] não encontrada para o projeto [${slugProjeto}]`);
                  setError({ 
                    status: 404, 
                    message: "Edição não encontrada.",
                    actionPath: `/${username}/${slugProjeto}/edicoes`,
                    actionText: "Voltar para Edições"
                  });
                  return;
                }
                setEdicao(currentEdicao || null);

                // 3. Fetch Turma if slug exists
                if (slugTurma) {
                  const resTur = await apiFetch(`${username}/${slugProjeto}/${slugEdicao}/turmas/`);
                  if (resTur.ok && resTur.headers.get('content-type')?.includes('application/json')) {
                    const turmas: Turma[] = await resTur.json();
                    const currentTurma = turmas.find(t => t.slug === slugTurma);
                    
                    if (!currentTurma) {
                      setError({ 
                        status: 404, 
                        message: "Turma não encontrada.",
                        actionPath: `/${username}/${slugProjeto}/${slugEdicao}/turmas`,
                        actionText: "Voltar para Turmas"
                      });
                      return;
                    }
                    setTurma(currentTurma);
                  }
                } else {
                  setTurma(null);
                }
              }
            } else {
              setEdicao(null);
              setTurma(null);
            }
            
          }
        }
      } catch (error) {
        console.error('Erro fatal ao identificar detalhes do projeto:', error);
        setError({ 
          status: 500, 
          message: "Erro de comunicação com o servidor. A rota pode ser inválida.",
          actionPath: `/${username}/projetos`,
          actionText: "Voltar para Projetos"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllDetails();
  }, [username, slugProjeto, slugEdicao, slugTurma, userUsername]);

  const refreshUser = async () => {
    try {
      const res = await apiFetch('/auth/me');
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        const userData = await res.json();
        setUserUsername(userData.username);
        setUser(userData);
      }
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário no contexto:", error);
    }
  };

  // Efeito SEPARADO apenas para verificação de rotas (Client-Side Route Guard)
  useEffect(() => {
    if (!papel || !slugProjeto) return;

    const adminRoutes = [
      '/turmas', '/metricas', '/grupos', '/alunos', '/nova_edicao', '/informacoes', '/informacoes_do_projeto', '/checkout'
    ];
    const memberRoutes = ['/home', '/registrar_coleta'];

    const isTryingAdminRoute = adminRoutes.some(route => pathname.includes(route));
    const isTryingMemberRoute = memberRoutes.some(route => pathname.includes(route));

    if (papel === 'membro' && isTryingAdminRoute) {
      console.warn('Acesso negado: Redirecionando membro para home');
      router.replace(`/${username}/${slugProjeto}/${slugEdicao || ''}/home`);
    }

    if (papel === 'adm' && isTryingMemberRoute) {
      console.warn('Acesso negado: Redirecionando adm para turmas');
      router.replace(`/${username}/${slugProjeto}/${slugEdicao || ''}/turmas`);
    }
  }, [pathname, papel, router, username, slugProjeto, slugEdicao]);

  return (
    <ProjectContext.Provider value={{ projeto, edicao, turma, papel, userUsername, user, isLoading, error, refreshUser }}>
      {(isLoading || !userLoaded) ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100vh', background: '#0a0a0a' }}>
        </div>
      ) : error ? (
        <ResourceNotFound 
          title={error.status === 403 ? "Acesso Negado" : "Página não encontrada"}
          message={error.message}
          actionPath={error.actionPath || `/${username}/projetos`}
          actionText={error.actionText || "Voltar para Meus Projetos"}
        />
      ) : children}
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
