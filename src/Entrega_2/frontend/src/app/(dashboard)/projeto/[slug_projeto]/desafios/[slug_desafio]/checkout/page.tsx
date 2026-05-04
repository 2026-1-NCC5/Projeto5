'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import styles from './page.module.css';

interface ItemDetectado {
  id: string;
  name: string;
  confidence: number;
  bbox: [number, number, number, number];
}

export default function CheckoutPage() {
  const { slug_desafio } = useParams();
  
  const [itens, setItens] = useState<ItemDetectado[]>([]);
  const [wsStatus, setWsStatus] = useState<'Conectado' | 'Desconectado'>('Desconectado');
  const [camStatus, setCamStatus] = useState('Aguardando permissão...');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Função para desenhar as labels sobre o vídeo
  const drawDetections = useCallback((detections: ItemDetectado[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    detections.forEach(det => {
      const [x1, y1, x2, y2] = det.bbox;
      const startX = x1 * canvas.width;
      const startY = y1 * canvas.height;
      const width = (x2 - x1) * canvas.width;
      const height = (y2 - y1) * canvas.height;

      ctx.strokeStyle = '#22c55e'; // Verde
      ctx.lineWidth = 3;
      ctx.strokeRect(startX, startY, width, height);

      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.fillText(`${det.name}`, startX, startY > 15 ? startY - 5 : startY + 15);
    });
  }, []);

  const enviarFrame = useCallback((socket: WebSocket) => {
    if (socket.readyState === WebSocket.OPEN && videoRef.current) {
      const video = videoRef.current;
      const tempCanvas = document.createElement('canvas');

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        tempCanvas.width = video.videoWidth;
        tempCanvas.height = video.videoHeight;
        const ctx = tempCanvas.getContext('2d');
        ctx?.drawImage(video, 0, 0);
        
        if (canvasRef.current) {
            canvasRef.current.width = video.videoWidth;
            canvasRef.current.height = video.videoHeight;
        }

        const frameBase64 = tempCanvas.toDataURL('image/jpeg', 0.4);
        socket.send(frameBase64);
      }
    }
  }, []);

  const connectWS = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const socket = new WebSocket(`ws://localhost:8000/checkout/ws/${slug_desafio}`);
    wsRef.current = socket;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Assume-se que o backend retorna a lista de detecções em data.items
      if (data.event === "new_detection" || data.items) {
        const detections = data.items || [];
        setItens(detections);
        drawDetections(detections);
      }
    };

    socket.onopen = () => {
      setWsStatus('Conectado');
      streamIntervalRef.current = setInterval(() => enviarFrame(socket), 500);
    };

    socket.onclose = () => {
      setWsStatus('Desconectado');
      clearInterval(streamIntervalRef.current!);
      setTimeout(connectWS, 3000);
    };
  }, [slug_desafio, enviarFrame, drawDetections]);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCamStatus('Câmera: Ativa');
        }
      } catch (err) {
        setCamStatus('Erro ao acessar webcam');
      }
    }
    startCamera();
    connectWS();
    return () => {
      clearInterval(streamIntervalRef.current!);
      wsRef.current?.close();
    };
  }, [connectWS]);

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>AI Checkout</h1>
        <p className={styles.subtitle}>Detecção para o desafio: <strong>{slug_desafio}</strong></p>
      </header>

      <div className={styles.dashboard}>
        {/* Painel de Visão com Canvas Sobreposto */}
        <section className={styles.visionPanel}>
          <div className={styles.videoContainer} style={{ position: 'relative' }}>
            <video ref={videoRef} autoPlay playsInline muted className={styles.video} />
            <canvas 
              ref={canvasRef} 
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }} 
            />
          </div>
          <div className={styles.statusBar}>
            <div className={`${styles.badge} ${wsStatus === 'Conectado' ? styles.online : styles.offline}`}>
              WS: {wsStatus}
            </div>
            <div className={styles.badge}>{camStatus}</div>
          </div>
        </section>

        {/* Painel de Inventário Lateral */}
        <section className={styles.inventoryPanel}>
          <div className={styles.inventoryHeader}>
            <span className="material-symbols-outlined">inventory_2</span>
            <h2>Itens Identificados</h2>
          </div>
          
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Confiança</th>
                </tr>
              </thead>
              <tbody>
                {itens.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{(item.confidence * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button className={styles.finishBtn} disabled={itens.length === 0}>
            Finalizar e Salvar Coleta
          </button>
        </section>
      </div>
    </main>
  );
}