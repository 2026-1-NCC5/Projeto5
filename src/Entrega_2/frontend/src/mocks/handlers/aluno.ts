import { http, HttpResponse } from 'msw';
import { mockAlunos } from '../list/aluno';
import { Aluno } from '@/types';

let alunos = [...mockAlunos];

export const alunoHandlers = [
  // GET all alunos
  http.get('*/alunos', () => {
    return HttpResponse.json(alunos);
  }),

  // POST new aluno
  http.post('*/alunos', async ({ request }) => {
    const newAluno = await request.json() as Aluno;
    newAluno.id = Math.floor(Math.random() * 10000);
    alunos.push(newAluno);
    return HttpResponse.json(newAluno, { status: 201 });
  }),

  // PUT update aluno
  http.put('*/alunos/:id', async ({ params, request }) => {
    const { id } = params;
    const updatedData = await request.json() as Partial<Aluno>;
    
    alunos = alunos.map(a => 
      a.id?.toString() === id ? { ...a, ...updatedData } : a
    );
    
    const updatedAluno = alunos.find(a => a.id?.toString() === id);
    return HttpResponse.json(updatedAluno);
  }),

  // DELETE aluno
  http.delete('*/alunos/:id', ({ params }) => {
    const { id } = params;
    alunos = alunos.filter(a => a.id?.toString() !== id);
    return new HttpResponse(null, { status: 204 });
  }),
];
