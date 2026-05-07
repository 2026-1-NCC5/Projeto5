import { http, HttpResponse } from 'msw';
import { Turma, Aluno } from '@/types'; // Importando os novos types
import { turmasMock } from '../list/turma';

export const turmaHandlers = [
  // GET: Listar todas as turmas[cite: 6]
  http.get('*/api/turmas', () => {
    return HttpResponse.json(turmasMock);
  }),

  // POST: Cadastro de aluno individual[cite: 6]
  http.post('*/alunos', async ({ request }) => {
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
  http.post('*/alunos/importar', async ({ request }) => {
    const formData = await request.formData();
    const arquivo = formData.get('file');

    if (!arquivo) {
      return new HttpResponse('Nenhum arquivo enviado', { status: 400 });
    }

    console.log('MSW: Processando arquivo:', (arquivo as File).name);
    return HttpResponse.json({ message: 'Processamento iniciado com sucesso' });
  }),
];