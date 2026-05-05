import React, { useState, useEffect } from 'react';
import styles from './CalibrationPanel.module.css';

interface CalibrationPanelProps {
  isCalibrating: boolean;
  setIsCalibrating: (val: boolean) => void;
  calibrationSize: number;
  setCalibrationSize: (val: number) => void;
  cooldown: number;
  setCooldown: (val: number) => void;
}

export const CalibrationPanel: React.FC<CalibrationPanelProps> = ({
  isCalibrating,
  setIsCalibrating,
  calibrationSize,
  setCalibrationSize,
  cooldown,
  setCooldown
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Fecha o painel automaticamente ao finalizar a calibração
  const handleFinishCalibration = () => {
    setIsCalibrating(false);
    setIsExpanded(false);
  };

  return (
    <div className={`${styles.container} ${!isExpanded ? styles.collapsed : ''}`}>
      <div className={styles.header} onClick={() => setIsExpanded(!isExpanded)}>
        <div className={styles.titleWithIcon}>
          <svg 
            className={`${styles.chevron} ${isExpanded ? styles.rotate : ''}`} 
            width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6"/>
          </svg>
          <h3>Configurações de Lente</h3>
        </div>
        
        {!isExpanded && (
          <span className={styles.miniStatus}>
            {isCalibrating ? 'CALIBRANDO' : `Escala: ${calibrationSize}px`}
          </span>
        )}

        {isExpanded && (
          <button 
            className={`${styles.calibBtn} ${isCalibrating ? styles.active : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              if (isCalibrating) handleFinishCalibration();
              else setIsCalibrating(true);
            }}
          >
            {isCalibrating ? 'Confirmar Calibração' : 'Recalibrar'}
          </button>
        )}
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.controls}>
          {isCalibrating ? (
            <div className={styles.calibBox}>
              <p className={styles.info}>
                <strong>Passo Obrigatório:</strong> Ajuste o guia amarelo sobre o quadrado de 30x30cm da sua base antes de iniciar.
              </p>
              <div className={styles.sliderGroup}>
                <div className={styles.labelRow}>
                  <label>Escala (Pixels por 30cm)</label>
                  <span>{calibrationSize}px</span>
                </div>
                <input 
                  type="range" 
                  min="100" 
                  max="600" 
                  value={calibrationSize} 
                  onChange={(e) => setCalibrationSize(parseInt(e.target.value))} 
                  className={styles.slider}
                />
              </div>
            </div>
          ) : (
            <div className={styles.cooldownGroup}>
              <div className={styles.labelRow}>
                <label>Filtro de Duplicidade (Cooldown)</label>
                <span>{cooldown}s</span>
              </div>
              <div className={styles.btnRow}>
                <button onClick={() => setCooldown(Math.max(0.5, cooldown - 0.5))}>-</button>
                <div className={styles.track}>
                  <div 
                    className={styles.fill} 
                    style={{ width: `${(cooldown / 10) * 100}%` }}
                  />
                </div>
                <button onClick={() => setCooldown(Math.min(10, cooldown + 0.5))}>+</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
