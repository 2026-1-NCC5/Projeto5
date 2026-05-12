import { mockAlunos, mockGrupos } from './data/academic';
import { mockColetas } from './data/inventory';

// Re-export everything from the new modules
export * from './data/auth';
export * from './data/core';
export * from './data/academic';
export * from './data/inventory';
export * from './data/analytics';

/**
 * VINCULAÇÕES E TOTAIS
 * Aplicamos as relações circulares aqui no arquivo central para evitar
 * problemas de dependência cíclica entre os arquivos de domínio.
 */

// 1. Vincular Alunos aos Grupos
mockAlunos[0].grupo = mockGrupos[0];
mockAlunos[1].grupo = mockGrupos[1];
mockAlunos[2].grupo = mockGrupos[0];
mockAlunos[3].grupo = mockGrupos[2];
mockAlunos[4].grupo = mockGrupos[2];

// 2. Vincular Grupos aos seus Alunos
mockGrupos[0].alunos = [mockAlunos[0], mockAlunos[2]];
mockGrupos[1].alunos = [mockAlunos[1]];
mockGrupos[2].alunos = [mockAlunos[3], mockAlunos[4]];

// 3. Vincular Grupos às suas Coletas
mockGrupos[0].coletas = [mockColetas[0], mockColetas[1]];
mockGrupos[1].coletas = [mockColetas[2]];

// 4. Calcular Totais dos Grupos
mockGrupos.forEach(g => {
  g.pesoTotal = g.coletas.reduce((acc, c) => acc + c.pesoTotal, 0);
  g.precoTotal = g.coletas.reduce((acc, c) => acc + c.precoTotal, 0);
});
