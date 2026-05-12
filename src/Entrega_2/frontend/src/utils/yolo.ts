import { Tensor } from 'onnxruntime-web';

export const LABELS = [
  'pacote_de_arroz', // 0
  'pacote_de_feijao', // 1
  'pacote_de_macarrão', // 2
  'pacote_de_fuba', // 3
  'pacote_de_acucar', // 4
  'garrafa_de_oleo' // 5
];

/**
 * Preprocesses a video or canvas into a 1x3x640x640 Float32Array tensor.
 */
export function preprocess(
  source: HTMLVideoElement | HTMLCanvasElement,
  modelWidth: number,
  modelHeight: number
): [Tensor, number, number] {
  const canvas = document.createElement('canvas');
  canvas.width = modelWidth;
  canvas.height = modelHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

  const srcW = source instanceof HTMLCanvasElement ? source.width : source.videoWidth;
  const srcH = source instanceof HTMLCanvasElement ? source.height : source.videoHeight;

  // To maintain aspect ratio and pad (letterboxing)
  let xRatio = modelWidth / srcW;
  let yRatio = modelHeight / srcH;
  
  const ratio = Math.min(xRatio, yRatio);
  const newWidth = Math.round(srcW * ratio);
  const newHeight = Math.round(srcH * ratio);
  
  const xPad = (modelWidth - newWidth) / 2;
  const yPad = (modelHeight - newHeight) / 2;

  ctx.fillStyle = '#000000'; // YOLO expects padding color, usually grey but black is common
  ctx.fillRect(0, 0, modelWidth, modelHeight);
  ctx.drawImage(source, xPad, yPad, newWidth, newHeight);

  const imgData = ctx.getImageData(0, 0, modelWidth, modelHeight);
  const data = imgData.data;

  // CHW format Float32Array
  const float32Data = new Float32Array(1 * 3 * modelWidth * modelHeight);
  for (let i = 0; i < modelWidth * modelHeight; i++) {
    // rgb in 0-1
    float32Data[i] = data[i * 4] / 255.0; // R
    float32Data[modelWidth * modelHeight + i] = data[i * 4 + 1] / 255.0; // G
    float32Data[modelWidth * modelHeight * 2 + i] = data[i * 4 + 2] / 255.0; // B
  }

  const tensor = new Tensor('float32', float32Data, [1, 3, modelHeight, modelWidth]);
  return [tensor, xPad, yPad];
}

function iou(box1: number[], box2: number[]) {
  const x1 = Math.max(box1[0], box2[0]);
  const y1 = Math.max(box1[1], box2[1]);
  const x2 = Math.min(box1[2], box2[2]);
  const y2 = Math.min(box1[3], box2[3]);
  
  const intersect = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
  const area1 = (box1[2] - box1[0]) * (box1[3] - box1[1]);
  const area2 = (box2[2] - box2[0]) * (box2[3] - box2[1]);
  
  return intersect / (area1 + area2 - intersect);
}

export function processOutput(
  output: Tensor,
  canvasWidth: number,
  canvasHeight: number,
  xPad: number,
  yPad: number,
  modelWidth: number,
  modelHeight: number
) {
  const data = output.data as Float32Array;
  const numClasses = 6; // Arroz, Feijao, Macarrao, Fuba, Acucar, Oleo
  const numRows = 4 + numClasses; // 9
  const numCols = 8400; // YOLOv8 default anchors

  let boxes: any[] = [];

  for (let col = 0; col < numCols; col++) {
    // Find max class probability
    let maxConf = 0;
    let maxClass = -1;
    for (let c = 0; c < numClasses; c++) {
      const conf = data[(4 + c) * numCols + col];
      if (conf > maxConf) {
        maxConf = conf;
        maxClass = c;
      }
    }

    if (maxConf > 0.5) {
      const cx = data[0 * numCols + col];
      const cy = data[1 * numCols + col];
      const w = data[2 * numCols + col];
      const h = data[3 * numCols + col];

      // Convert to Top-Left
      let x1 = cx - w / 2;
      let y1 = cy - h / 2;
      let x2 = cx + w / 2;
      let y2 = cy + h / 2;

      // Adjust for padding and scale back to original canvas
      const ratio = Math.min(modelWidth / canvasWidth, modelHeight / canvasHeight);
      x1 = (x1 - xPad) / ratio;
      y1 = (y1 - yPad) / ratio;
      x2 = (x2 - xPad) / ratio;
      y2 = (y2 - yPad) / ratio;

      boxes.push({
        box: [x1, y1, x2, y2],
        score: maxConf,
        classIdx: maxClass
      });
    }
  }

  // NMS
  boxes.sort((a, b) => b.score - a.score);
  const nmsBoxes: any[] = [];
  while (boxes.length > 0) {
    const current = boxes[0];
    nmsBoxes.push(current);
    boxes = boxes.filter(b => b.classIdx !== current.classIdx || iou(current.box, b.box) < 0.45);
  }

  return nmsBoxes.map(b => ({
    name: LABELS[b.classIdx] || 'unknown',
    confidence: b.score,
    bbox: b.box
  }));
}
