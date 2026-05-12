'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import * as ort from 'onnxruntime-web';
import { ColetaItem } from '@/types';
import { mockItemsBase } from '@/mocks/data';
import { preprocess, processOutput } from '@/utils/yolo';
import { MeasurementService } from '@/services/mensureService';

// Configuração ONNX
ort.env.wasm.wasmPaths = '/';

export interface ExtendedColetaItem extends ColetaItem {
  id: string; // ID único para a lista (UI)
  catalogoId: number; // ID real do banco de dados
  labelNome: string;
  bbox?: [number, number, number, number];
}

export interface CalibrationRect {
  x: number;
  y: number;
  size: number;
}

export function useCheckoutAI() {
  const [itens, setItens] = useState<ExtendedColetaItem[]>([]);
  const [engineStatus, setEngineStatus] = useState('Carregando Modelo...');
  const [camStatus, setCamStatus] = useState('Aguardando permissão...');
  const [cooldown, setCooldown] = useState<number>(3);
  const [isCalibrating, setIsCalibrating] = useState(true);
  const [calibrationSize, setCalibrationSize] = useState(300);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sessionRef = useRef<ort.InferenceSession | null>(null);
  const isInferencing = useRef(false);
  const lastScannedRef = useRef<Record<string, number>>({});
  const calibrationRect = useRef<CalibrationRect>({ x: 0, y: 0, size: 300 });

  const measurementService = useMemo(() => new MeasurementService(), []);

  // Load Model
  useEffect(() => {
    async function loadModel() {
      try {
        const session = await ort.InferenceSession.create('/models/best.onnx', { 
          executionProviders: ['webgl', 'wasm'] 
        });
        sessionRef.current = session;
        setEngineStatus('Modelo Pronto');
      } catch (e) {
        setEngineStatus('Erro no Modelo');
      }
    }
    loadModel();
  }, []);

  const drawUI = useCallback((detections: ExtendedColetaItem[]) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (isCalibrating) {
      const centerX = video.videoWidth / 2;
      const centerY = video.videoHeight / 2;
      const x = centerX - calibrationSize / 2;
      const y = centerY - calibrationSize / 2;

      ctx.fillStyle = 'rgba(148, 163, 184, 0.3)';
      ctx.fillRect(x, y, calibrationSize, calibrationSize);
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, calibrationSize, calibrationSize);
      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 16px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('AJUSTE DE ESCALA (30x30cm)', centerX, y - 15);
      
      calibrationRect.current = { x, y, size: calibrationSize };
      ctx.textAlign = 'start';
      return; 
    }

    detections.forEach(det => {
      if (!det.bbox) return;
      const [x1, y1, x2, y2] = det.bbox;
      const isHighConfidence = det.grau_de_confianca >= 0.7;
      const color = isHighConfidence ? '#10b981' : '#ef4444';

      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
      ctx.fillStyle = color;
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.fillText(det.nome, x1, y1 > 15 ? y1 - 5 : y1 + 15);
    });
  }, [isCalibrating, calibrationSize]);

  const detectFrame = useCallback(async () => {
    if (!videoRef.current || isInferencing.current) return;
    
    if (isCalibrating) {
      drawUI([]);
      return;
    }

    if (!sessionRef.current) return;
    
    const video = videoRef.current;
    if (video.readyState !== video.HAVE_ENOUGH_DATA) return;

    try {
      isInferencing.current = true;
      const [tensor, xPad, yPad] = await preprocess(video, 640, 640);
      const output = await sessionRef.current.run({ images: tensor });
      const detected = processOutput(
        output.output0, 
        video.videoWidth, 
        video.videoHeight,
        xPad,
        yPad,
        640,
        640
      );

      measurementService.calibrate(calibrationRect.current.size);

      const mappedItems: ExtendedColetaItem[] = detected.map((det) => {
        const [x1, y1, x2, y2] = det.bbox;
        const variant = measurementService.identifyVariation(det.name, x2 - x1, y2 - y1);

        return {
          id: Math.random().toString(36).substr(2, 9),
          catalogoId: variant?.id || 0,
          nome: variant?.nome || 'Produto Desconhecido',
          labelNome: det.name,
          preco: variant?.preco || 0,
          peso: variant?.peso || 0,
          grau_de_confianca: det.confidence,
          bbox: det.bbox as [number, number, number, number],
        };
      });

      const now = Date.now();
      const newItems: ExtendedColetaItem[] = [];

      mappedItems.forEach(item => {
        const lastScan = lastScannedRef.current[item.labelNome] || 0;
        if (now - lastScan > (cooldown * 1000) && item.grau_de_confianca >= 0.75) {
          newItems.push(item);
          lastScannedRef.current[item.labelNome] = now;
        }
      });

      if (newItems.length > 0) {
        setItens(prev => [...prev, ...newItems]);
      }

      drawUI(mappedItems);
    } catch (err) {
      console.error('Inference error:', err);
    } finally {
      isInferencing.current = false;
    }
  }, [cooldown, drawUI, isCalibrating, measurementService]);

  // Camera Init
  useEffect(() => {
    let stream: MediaStream | null = null;
    async function setupCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCamStatus('Câmera: Ativa');
        }
      } catch (err) {
        setCamStatus('Erro na Câmera');
      }
    }
    setupCamera();
    return () => stream?.getTracks().forEach(t => t.stop());
  }, []);

  // Stable Loop
  useEffect(() => {
    let animationId: number;
    let timeoutId: NodeJS.Timeout;
    const loop = async () => {
      await detectFrame();
      timeoutId = setTimeout(() => {
        animationId = requestAnimationFrame(loop);
      }, 150);
    };
    if (camStatus === 'Câmera: Ativa') loop();
    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(timeoutId);
    };
  }, [detectFrame, camStatus]);

  return {
    itens, setItens,
    engineStatus, camStatus,
    cooldown, setCooldown,
    isCalibrating, setIsCalibrating,
    calibrationSize, setCalibrationSize,
    videoRef, canvasRef,
    handleCancel: () => {
      setItens([]);
      lastScannedRef.current = {};
    }
  };
}
