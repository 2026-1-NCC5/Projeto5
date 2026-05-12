import { http, HttpResponse } from 'msw';
import { Turma, Aluno } from '@/types'; // Importando os novos tipos
import { turmasMock } from '../data';

export const turmaHandlers = [
  // Listagem filtrada por Usuário, Projeto e Edição (Multi-tenant Real)
  http.get('*/:username/:slugProjeto/:slugEdicao/turmas', ({ params }) => {
    const { username, slugProjeto, slugEdicao } = params;
    const filtered = turmasMock.filter(t => 
      t.edicao.slug === slugEdicao && 
      t.edicao.projeto.slug === slugProjeto
    );
    return HttpResponse.json(filtered);
  }),

  // POST: Adicionar nova turma (Multi-tenant Real)
  http.post('*/:username/:slugProjeto/:slugEdicao/turmas', async ({ params, request }) => {
    const { username } = params;
    const dados = await request.json() as any;
    const novaTurma = {
      id: turmasMock.length + 1,
      nome: dados.nome,
      slug: dados.nome.toLowerCase().replace(/\s+/g, '-'),
      // No mock real buscaríamos a edição pelo slug, aqui simplificamos
      edicao: turmasMock[0].edicao 
    };
    // Em um mock real salvaríamos em um array mutável
    return HttpResponse.json(novaTurma, { status: 201 });
  }),

  // PUT: Atualizar turma (Multi-tenant Real)
  http.put('*/:username/:slugProjeto/:slugEdicao/:slugTurma', async ({ params, request }) => {
    const { username } = params;
    const dados = await request.json() as any;
    return HttpResponse.json({ ...dados, slugTurma: dados.slugTurma });
  }),

  // DELETE: Excluir turma (Multi-tenant Real)
  http.delete('*/:username/:slugProjeto/:slugEdicao/:slugTurma', () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // POST: Cadastro de aluno individual[cite: 6]
  http.post('*/:username/:slugProjeto/:slugEdicao/aluno', async ({ request }) => {
    const novoAluno = await request.json() as Aluno;

    // Simulação de resposta do backend
    const alunoCriado = {
      ...novoAluno,
      id: Math.floor(Math.random() * 10000),
    };

    console.log('MSW: Aluno cadastrado:', alunoCriado);
    return HttpResponse.json(alunoCriado, { status: 201 });
  }),

  // POST: Importação em massa (CSV/Excel)[cite: 6]
  http.post('*/:username/:slugProjeto/:slugEdicao/turmas/alunos/importar', async ({ request }) => {
    const formData = await request.formData();
    const arquivo = formData.get('file');

    if (!arquivo) {
      return new HttpResponse('Nenhum arquivo enviado', { status: 400 });
    }

    console.log('MSW: Processando arquivo:', (arquivo as File).name);
    return HttpResponse.json({ message: 'Processamento iniciado com sucesso' });
  }),
];