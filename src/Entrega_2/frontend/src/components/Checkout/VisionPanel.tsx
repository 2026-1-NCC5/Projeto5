import React from 'react';
import styles from './VisionPanel.module.css';

interface VisionPanelProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  engineStatus: string;
  camStatus: string;
}

export const VisionPanel: React.FC<VisionPanelProps> = ({ 
  videoRef, 
  canvasRef, 
  engineStatus, 
  camStatus 
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.videoWrapper}>
        <video ref={videoRef} autoPlay playsInline muted className={styles.video} />
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>
      
      <div className={styles.statusBar}>
        <div className={`${styles.badge} ${engineStatus === 'Modelo Pronto' ? styles.online : styles.offline}`}>
          <span className={styles.dot} />
          {engineStatus}
        </div>
        <div className={`${styles.badge} ${camStatus === 'Câmera: Ativa' ? styles.online : styles.offline}`}>
          <span className={styles.dot} />
          {camStatus}
        </div>
      </div>
    </div>
  );
};
