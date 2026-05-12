import { http, HttpResponse } from 'msw';
import { mockMetricas } from '../data';

export const metricasHandlers = [
  http.get('*/:username/:slugProjeto/:slugEdicao/metricas', ({ params, request }) => {
    // Aqui poderíamos filtrar por slugProjeto e slugEdicao se tivéssemos dados reais
    return HttpResponse.json(mockMetricas);
  }),

  http.get('*/:username/:slugProjeto/:slugEdicao/metricas/export/excel', () => {
    // Simulate an Excel file blob response
    const mockCsvContent = "data:text/csv;charset=utf-8,ID,Nome,Valor\n1,Planilha Teste,100";
    const blob = new Blob([mockCsvContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    return new HttpResponse(blob, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="metricas_arrecadacao.xlsx"',
      },
    });
  }),

  http.get('*/:username/:slugProjeto/:slugEdicao/metricas/export/pdf', () => {
    // Simulate a PDF file blob response
    const mockPdfContent = "%PDF-1.4\n%Fake PDF content for MSW simulation";
    const blob = new Blob([mockPdfContent], { type: 'application/pdf' });
    
    return new HttpResponse(blob, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="dashboard_metricas.pdf"',
      },
    });
  })
];
