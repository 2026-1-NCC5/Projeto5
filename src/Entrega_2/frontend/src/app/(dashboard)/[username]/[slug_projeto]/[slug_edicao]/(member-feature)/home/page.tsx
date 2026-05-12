'use client';

import React, { useEffect, useMemo } from 'react';
import styles from './page.module.css';
import { RankingCard } from '@/components/memberHome/RankingCard';
import { HistoryCard } from '@/components/memberHome/HistoryCard';
import { InvitationCard } from '@/components/memberHome/InvitationCard';
import { CreateGroupCard } from '@/components/memberHome/CreateGroupCard';
// Refresh trigger for new components


import { useMetricas } from '@/hooks/useMetricas';
import { useRegistros } from '@/hooks/useRegistros';
import { useGrupos } from '@/hooks/useGrupos';
import { useConvites } from '@/hooks/useConvites';
import { useProject } from '@/contexts/ProjectContext';

import { useParams, useRouter } from 'next/navigation';

export default function MemberHomePage() {
  const { username, slug_projeto, slug_edicao } = useParams();
  const router = useRouter();
  const { user } = useProject();
  
  const { metricas, fetchMetricas, isLoading: isLoadingMetricas } = useMetricas();
  const { registros: historico, fetchRegistros: fetchMeusRegistros, isLoading: isLoadingRegistros } = useRegistros();
  const { grupos, fetchGrupos, addGrupo, isLoading: isLoadingGrupos } = useGrupos();
  const { 
    convites, 
    alunosSemGrupo, 
    fetchMeusConvites, 
    responderConvite, 
    fetchAlunosSemGrupo,
    enviarConvite 
  } = useConvites();
  
  const isLoading = isLoadingMetricas || isLoadingRegistros || isLoadingGrupos;

  // Verifica se o usuário já pertence a um grupo
  const grupoUsuario = useMemo(() => {
    return grupos.find(g => 
      g.alunos?.some(aluno => String(aluno.vinculo?.id) === String(user?.id))
    ) || (historico.length > 0 ? { nome: historico[0].grupo?.nome || 'Grupo' } : null);
  }, [grupos, historico, user]);

  const temGrupo = !!grupoUsuario;

  useEffect(() => {
    if (username && slug_projeto && slug_edicao && user?.id) {
      fetchMetricas(username as string, slug_projeto as string, slug_edicao as string);
      fetchMeusRegistros(username as string, slug_projeto as string, slug_edicao as string);
      fetchMeusConvites(username as string, slug_projeto as string, slug_edicao as string, user.id as number);
    }
  }, [fetchMetricas, fetchMeusRegistros, fetchMeusConvites, username, slug_projeto, slug_edicao, user?.id]);

  // Busca dados de turma e alunos sem grupo se necessário
  useEffect(() => {
    const turmaSlug = (historico.length > 0 && historico[0].aluno?.turma) ? historico[0].aluno.turma.slug : null;
    
    if (turmaSlug && username && slug_projeto && slug_edicao) {
      fetchGrupos(username as string, slug_projeto as string, slug_edicao as string, turmaSlug);
      if (!temGrupo) {
        fetchAlunosSemGrupo(username as string, slug_projeto as string, slug_edicao as string);
      }
    } else if (!temGrupo && username && slug_projeto && slug_edicao) {
      fetchAlunosSemGrupo(username as string, slug_projeto as string, slug_edicao as string);
    }
  }, [historico, fetchGrupos, fetchAlunosSemGrupo, temGrupo, username, slug_projeto, slug_edicao]);

  const handleResponderConvite = async (id: string | number, status: 'aceito' | 'recusado') => {
    const statusBackend = status === 'recusado' ? 'negado' : 'aceito';
    await responderConvite(
      username as string, 
      slug_projeto as string, 
      slug_edicao as string, 
      id as number, 
      statusBackend
    );
    if (status === 'aceito') {
      router.refresh(); 
    }
  };

  const handleCriarGrupo = async (nome: string, convidadosIds: (string | number)[]) => {
    try {
      const turmaId = (historico.length > 0 && historico[0].aluno?.turma) ? historico[0].aluno.turma.id : undefined;
      
      const novoGrupo = await addGrupo(
        username as string, 
        slug_projeto as string, 
        slug_edicao as string, 
        { 
          nome, 
          turma_id: turmaId as number,
          alunos: [] 
        }
      );

      if (novoGrupo && user?.id) {
        for (const convidadoId of convidadosIds) {
          await enviarConvite(
            username as string, 
            slug_projeto as string, 
            slug_edicao as string, 
            {
              criador_id: user.id as number,
              convidado_id: convidadoId as number,
              grupo_id: novoGrupo.id
            }
          );
        }
      }

      alert('Grupo criado e convites enviados!');
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('Erro ao criar grupo.');
    }
  };

  if (isLoading) return <div className={styles.loading}>Carregando...</div>;

  return (
    <main className={styles.container}>
      <header className={styles.welcomeSection}>
        <h1>Bem-vindo, {user?.nome || 'Estudante'}!</h1>
        <p>
          {temGrupo 
            ? `Você faz parte do grupo ${grupoUsuario.nome}. Acompanhe seu desempenho abaixo.`
            : 'Você ainda não possui um grupo para esta edição. Aceite um convite ou crie o seu próprio.'}
        </p>
      </header>

      {temGrupo ? (
        <>
          <InvitationCard 
            convites={convites} 
            onResponder={handleResponderConvite} 
          />
          <div className={styles.grid}>
            <RankingCard 
              ranking={metricas?.ranking_grupos || []} 
              meuGrupoNome={grupoUsuario.nome} 
            />
            
            <HistoryCard 
              historico={historico} 
              grupoNome={grupoUsuario.nome} 
            />
          </div>
        </>
      ) : (
        <div className={styles.onboardingGrid}>
          <div className={styles.onboardingItem}>
            <InvitationCard 
              convites={convites} 
              onResponder={handleResponderConvite} 
            />
          </div>
          <div className={styles.onboardingItem}>
            <CreateGroupCard 
              alunosSemGrupo={alunosSemGrupo} 
              onCriarGrupo={handleCriarGrupo} 
            />
          </div>
        </div>
      )}
    </main>
  );
}
