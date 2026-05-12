import { http, HttpResponse } from 'msw';
import { Projeto } from '@/types';
import { projetosMock, userProjectRolesMock, usersMock } from '../data';

// Banco de dados em memória para projetos (iniciado com o mock)
let projetos: Projeto[] = [...projetosMock];

export const projetoHandlers = [
  // Handler unificado para listagem de projetos (Multi-tenant por Usuário)
  http.get('*/:username/projetos', ({ params, request }) => {
    const { username } = params;
    const cookies = request.headers.get('cookie') || '';
    const userIdMatch = cookies.match(/user_id=([^;]+)/);
    const userId = userIdMatch ? userIdMatch[1] : '1';

    // Validação de Identidade: Garante que o username na URL pertence ao usuário logado
    const loggedInUser = usersMock.find(u => String(u.id) === String(userId));
    if (loggedInUser && loggedInUser.username !== username) {
      console.error(`MSW: Acesso negado. URL user [${username}] != Logged user [${loggedInUser.username}]`);
      return new HttpResponse(JSON.stringify({ error: 'Acesso negado' }), { status: 403 });
    }

    const projetosComPapel = projetos.map(p => {
      // Busca o papel deste usuário específico para este projeto específico
      const roleRelation = userProjectRolesMock.find(
        r => String(r.userId) === String(userId) && String(r.projectId) === String(p.id)
      );
      
      return {
        ...p,
        papel: roleRelation ? roleRelation.papel : 'membro'
      };
    });

    return HttpResponse.json(projetosComPapel);
  }),

  http.post('*/:username/projetos', async ({ request }) => {
    const dados = await request.json() as any;

    const novoProjeto: Projeto = {
      id: Date.now(), 
      nome: dados.nome,
      slug: dados.slug,
      tipo: dados.tipo,
      papel: 'adm', 
      ativo: true,
      dataCriacao: new Date().toLocaleDateString('pt-BR'),
      imagem: `https://picsum.photos/seed/${dados.slug}/600/400`
    };

    projetos.push(novoProjeto);
    return HttpResponse.json(novoProjeto, { status: 201 });
  }),

  // Update projeto info
  http.put('*/:username/:slugProjeto', async ({ request, params }) => {
    const slugProjeto = params.slugProjeto as string;
    const dados = await request.json() as Partial<Projeto>;

    const index = projetos.findIndex(p => p.slug === slugProjeto);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    // Atualiza o projeto preservando ID e data de criação se não enviados
    projetos[index] = {
      ...projetos[index],
      ...dados,
      // Garante que o slug mude se o nome mudar (opcional, mas comum)
      slug: dados.nome ? dados.nome.toLowerCase().replace(/\s+/g, '-') : projetos[index].slug
    };

    console.log(`MSW: Projeto ${slugProjeto} atualizado:`, projetos[index]);
    return HttpResponse.json(projetos[index]);
  }),

  http.delete('*/:username/:slugProjeto', async ({ params }) => {
    const slugProjeto = params.slugProjeto as string;
    const index = projetos.findIndex(p => p.slug === slugProjeto);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    projetos.splice(index, 1);
    return new HttpResponse(null, { status: 200 });
  })
];