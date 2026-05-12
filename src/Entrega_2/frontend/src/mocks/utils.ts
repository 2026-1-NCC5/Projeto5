/**
 * Utility to remove circular references for MSW JSON responses.
 * It's a simple flattener that replaces potential circular objects with 
 * simplified versions for common project entities.
 */
export function sanitizeForJSON(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeForJSON(item));
  }

  const result: any = {};
  for (const key in obj) {
    const value = obj[key];

    // Evitar circularidade em relacionamentos comuns
    if (key === 'grupo' && value && value.alunos) {
      result[key] = { id: value.id, nome: value.nome }; // Versão simplificada
    } else if (key === 'alunos' && Array.isArray(value)) {
      result[key] = value.map(a => ({ id: a.id, nome: a.nome, email: a.email, ra: a.ra }));
    } else if (key === 'edicao' && value && value.projeto) {
      result[key] = { id: value.id, nome: value.nome, slug: value.slug };
    } else if (key === 'turma' && value && value.edicao) {
      result[key] = { id: value.id, nome: value.nome, slug: value.slug };
    } else if (key === 'coletas' && Array.isArray(value)) {
      result[key] = value.map(c => ({ id: c.id, dataHora: c.dataHora, pesoTotal: c.pesoTotal }));
    } else {
      result[key] = sanitizeForJSON(value);
    }
  }
  return result;
}
