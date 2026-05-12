import { http, HttpResponse } from 'msw';
import { mockAlunos } from '../data';
import { Aluno } from '@/types';
import { sanitizeForJSON } from '../utils';

let alunos = [...mockAlunos];

export const alunoHandlers = [
  // Listagem ultra-filtrada (Multi-tenant Real)
  http.get('*/:username/:slugProjeto/:slugEdicao/:slugTurma/alunos', ({ params }) => {
    const { username, slugProjeto, slugEdicao, slugTurma } = params;
    const filtered = mockAlunos.filter(a => 
      a.turma.slug === slugTurma && 
      a.turma.edicao.slug === slugEdicao && 
      a.turma.edicao.projeto.slug === slugProjeto
    );
    return HttpResponse.json(sanitizeForJSON(filtered));
  }),

  // POST new aluno (Multi-tenant Real)
  http.post('*/:username/:slugProjeto/:slugEdicao/:slugTurma/alunos', async ({ params, request }) => {
    const { username } = params;
    const newAluno = await request.json() as Aluno;
    newAluno.id = Math.floor(Math.random() * 10000);
    alunos.push(newAluno);
    return HttpResponse.json(newAluno, { status: 201 });
  }),

  // PUT update aluno (Multi-tenant Real)
  http.put('*/:username/:slugProjeto/:slugEdicao/:slugTurma/alunos/:id', async ({ params, request }) => {
    const { username, id } = params;
    const updatedData = await request.json() as Partial<Aluno>;
    
    alunos = alunos.map(a => 
      a.id?.toString() === id ? { ...a, ...updatedData } : a
    );
    
    const updatedAluno = alunos.find(a => a.id?.toString() === id);
    return HttpResponse.json(updatedAluno);
  }),

  // DELETE aluno (Multi-tenant Real)
  http.delete('*/:username/:slugProjeto/:slugEdicao/:slugTurma/alunos/:id', ({ params }) => {
    const { username, id } = params;
    alunos = alunos.filter(a => a.id?.toString() !== id);
    return new HttpResponse(null, { status: 204 });
  }),
];
