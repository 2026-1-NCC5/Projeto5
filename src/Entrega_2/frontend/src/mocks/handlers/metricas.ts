import { http, HttpResponse } from 'msw';
import { mockMetricas } from '../list/metricas';

export const metricasHandlers = [
  http.get('*/api/metricas', ({ request }) => {
    // We could parse request.url to get 'turmas' and 'periodo' query params
    // and dynamically modify the mock data, but for now we just return the base mock.
    
    return HttpResponse.json(mockMetricas);
  }),

  http.get('*/api/metricas/export/excel', () => {
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

  http.get('*/api/metricas/export/pdf', () => {
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
