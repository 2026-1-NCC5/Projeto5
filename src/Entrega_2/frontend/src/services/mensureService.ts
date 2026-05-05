import { Item } from "@/types";
import { mockItemsBase } from "@/mocks/list/item";

export class MeasurementService {
  private ppcm: number = 0; // Pixels Por Centímetro

  // Calibra usando o quadrado de 30x30cm do seu overlay
  calibrate(pixelsOf30cm: number) {
    this.ppcm = pixelsOf30cm / 30;
  }

  // Função Pitagórica para Diagonal
  private getDiagonal(a: number, b: number): number {
    return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
  }

  identifyVariation(label: string, boxWidthPx: number, boxHeightPx: number): Item | null {
    if (this.ppcm === 0) return null;

    // Converte as dimensões da box detectada para CM
    const boxWidthCm = boxWidthPx / this.ppcm;
    const boxHeightCm = boxHeightPx / this.ppcm;
    const largestBoxSide = Math.max(boxWidthCm, boxHeightCm);

    // Busca as variações do produto no nosso mock usando a label do YOLO
    const productData = mockItemsBase[label];
    if (!productData) return null;

    const variations = productData.variants;

    for (const product of variations) {
      const productDiagonal = this.getDiagonal(product.comprimento, product.largura);
      const productLargestSide = Math.max(product.comprimento, product.largura);
      
      const tolerance = 2.5; // Tolerância ajustada para 2.5cm

      // Regra de Comparação:
      // 1. Maior lado da box <= Diagonal + tolerância
      // 2. Maior lado da box >= Maior lado do produto - tolerância
      const isWithinUpperLimit = largestBoxSide <= (productDiagonal + tolerance);
      const isWithinLowerLimit = largestBoxSide >= (productLargestSide - tolerance);

      if (isWithinUpperLimit && isWithinLowerLimit) {
        return product;
      }
    }

    // Retorna a última variante (geralmente a maior) ou null caso nada bata
    return variations.length > 0 ? variations[variations.length - 1] : null;
  }
}