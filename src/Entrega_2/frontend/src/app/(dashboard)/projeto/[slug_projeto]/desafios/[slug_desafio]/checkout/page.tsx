'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import styles from './page.module.css';

interface ItemDetectado {
  id: string;
  name: string;
}

export default function CheckoutPage() {
  const { slug_projeto, slug_desafio } = useParams();
  
  // Estados de Interface
  const [itens, setItens] = useState<ItemDetectado[]>([]);
  const [wsStatus, setWsStatus] = useState<'Conectado' | 'Desconectado'>('Desconectado');
  const [camStatus, setCamStatus] = useState('Aguardando permissão...');
  const [classesDisponiveis, setClassesDisponiveis] = useState<string[]>([]);
  
  // Referências para persistência fora do ciclo de render
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Efeito Sonoro de Confirmação
  const playBeep = useCallback(() => {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
  }, []);

  // 2. Envio de Frames para o Backend
  const enviarFrame = useCallback((socket: WebSocket) => {
    if (socket.readyState === WebSocket.OPEN && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Qualidade 0.4 para balanço entre nitidez e velocidade
        const frameBase64 = canvas.toDataURL('image/jpeg', 0.4);
        socket.send(frameBase64);
      }
    }
  }, []);

  // 3. Gerenciamento da Conexão WebSocket
  const connectWS = useCallback(() => {
    // Evita duplicidade de conexão
    if (wsRef.current?.readyState === WebSocket.OPEN || wsRef.current?.readyState === WebSocket.CONNECTING) return;

    const socket = new WebSocket(`ws://localhost:8000/checkout/ws/${slug_desafio}`);
    wsRef.current = socket;

    socket.onopen = () => {
      setWsStatus('Conectado');
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
      
      // Inicia o fluxo de frames (2 por segundo)
      streamIntervalRef.current = setInterval(() => enviarFrame(socket), 500);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.event === "new_detection") {
        setItens(data.items);
        if (data.just_detected?.length > 0) playBeep();
      }
    };

    socket.onclose = () => {
      setWsStatus('Desconectado');
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
      wsRef.current = null;
      // Tentativa de reconexão após 3 segundos
      setTimeout(connectWS, 3000);
    };

    socket.onerror = () => {
      socket.close();
    };
  }, [slug_desafio, enviarFrame, playBeep]);

  // 4. Inicialização de Hardware e Conexão
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

    // Limpeza ao desmontar o componente
    return () => {
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [connectWS]);

  const handleFinalizar = async () => {
    try {
      const response = await fetch(`http://localhost:8000/checkout/commit/${slug_desafio}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        alert('Dados sincronizados com sucesso!');
        setItens([]);
      }
    } catch (error) {
      alert('Erro ao finalizar operação.');
    }
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>AI Checkout</h1>
        <p className={styles.subtitle}>Detecção em tempo real para o desafio: <strong>{slug_desafio}</strong></p>
      </header>

      <div className={styles.dashboard}>
        {/* Painel de Visão */}
        <section className={styles.visionPanel}>
          <div className={styles.videoHeader}>
            <span className="material-symbols-outlined">videocam</span>
            <h2>Feed da Câmera</h2>
          </div>
          <div className={styles.videoContainer}>
            <video ref={videoRef} autoPlay playsInline muted className={styles.video} />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
          <div className={styles.statusBar}>
            <div className={`${styles.badge} ${wsStatus === 'Conectado' ? styles.online : styles.offline}`}>
              WS: {wsStatus}
            </div>
            <div className={styles.badge}>{camStatus}</div>
          </div>
        </section>

        {/* Painel de Inventário Detectado */}
        <section className={styles.inventoryPanel}>
          <div className={styles.inventoryHeader}>
            <span className="material-symbols-outlined">inventory_2</span>
            <h2>Itens Detectados</h2>
          </div>
          
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {itens.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>
                      <button className={styles.deleteBtn}>
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button 
            className={styles.finishBtn} 
            disabled={itens.length === 0}
            onClick={handleFinalizar}
          >
            Finalizar e Salvar Coleta
          </button>
        </section>
      </div>
    </main>
  );
}