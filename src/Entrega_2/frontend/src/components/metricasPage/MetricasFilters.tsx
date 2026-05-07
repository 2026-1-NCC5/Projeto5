import { useState, useRef, useEffect } from 'react';
import styles from './MetricasFilters.module.css';
import { Turma } from '@/types';

interface MetricasFiltersProps {
  turmas: Turma[];
  selectedTurmas: string[];
  setSelectedTurmas: (turmas: string[]) => void;
  dataInicio: string;
  setDataInicio: (data: string) => void;
  dataFim: string;
  setDataFim: (data: string) => void;
}

export function MetricasFilters({ 
  turmas, 
  selectedTurmas, 
  setSelectedTurmas,
  dataInicio,
  setDataInicio,
  dataFim,
  setDataFim
}: MetricasFiltersProps) {
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleTurmaToggle = (turmaId: string) => {
    if (selectedTurmas.includes(turmaId)) {
      setSelectedTurmas(selectedTurmas.filter(id => id !== turmaId));
    } else {
      setSelectedTurmas([...selectedTurmas, turmaId]);
    }
  };

  const isAllSelected = turmas.length > 0 && selectedTurmas.length === turmas.length;

  const handleToggleAll = () => {
    if (isAllSelected) {
      setSelectedTurmas([]);
    } else {
      setSelectedTurmas(turmas.map(t => t.id.toString()));
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await fetch('/api/metricas/export/excel');
      if (!response.ok) throw new Error('Erro ao exportar Excel');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'metricas_arrecadacao.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert('Não foi possível exportar o Excel.');
    }
  };

  const handleExportPDF = async () => {
    try {
      const response = await fetch('/api/metricas/export/pdf');
      if (!response.ok) throw new Error('Erro ao exportar PDF');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'dashboard_metricas.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert('Não foi possível exportar o PDF.');
    }
  };

  // Helper to open picker on click
  const handleDateClick = (e: React.MouseEvent<HTMLInputElement>) => {
    try {
      (e.currentTarget as any).showPicker();
    } catch (err) {
      // Fallback for browsers that don't support showPicker()
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.filterGroup}>
        <h3 className={styles.filterTitle}>Turmas</h3>
        <div className={styles.dropdownContainer} ref={dropdownRef}>
          <button 
            type="button" 
            className={styles.dropdownButton}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {isAllSelected ? 'Todas as Turmas' : `${selectedTurmas.length} selecionada(s)`}
            <span className={styles.chevron}>▼</span>
          </button>
          
          {isDropdownOpen && (
            <div className={styles.dropdownMenu}>
              <label className={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  checked={isAllSelected}
                  onChange={handleToggleAll}
                  className={styles.checkbox}
                />
                <span className={styles.checkboxText}>Todos</span>
              </label>
              <div className={styles.divider}></div>
              {turmas.map(turma => (
                <label key={turma.id} className={styles.checkboxLabel}>
                  <input 
                    type="checkbox" 
                    checked={selectedTurmas.includes(turma.id.toString())}
                    onChange={() => handleTurmaToggle(turma.id.toString())}
                    className={styles.checkbox}
                  />
                  <span className={styles.checkboxText}>{turma.nome}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.filterGroup}>
        <h3 className={styles.filterTitle}>Período</h3>
        <div className={styles.dateFilterContainer}>
          <input 
            type="date" 
            value={dataInicio} 
            onChange={(e) => setDataInicio(e.target.value)}
            onClick={handleDateClick}
            className={styles.input}
          />
          <span className={styles.dateSeparator}>até</span>
          <input 
            type="date" 
            value={dataFim} 
            onChange={(e) => setDataFim(e.target.value)}
            onClick={handleDateClick}
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.actionsGroup}>
        <button className={styles.exportButtonExcel} onClick={handleExportExcel}>
          <span className={styles.buttonIcon}>📊</span> Excel
        </button>
        <button className={styles.exportButtonPdf} onClick={handleExportPDF}>
          <span className={styles.buttonIcon}>📄</span> PDF
        </button>
      </div>
    </div>
  );
}
