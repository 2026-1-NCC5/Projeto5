import { Item } from "@/types";

export class MeasurementService {
  private ppcm: number = 0;

  calibrate(pixelsOf30cm: number) {
    this.ppcm = pixelsOf30cm / 30;
  }

  private getDiagonal(a: number, b: number): number {
    return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
  }

  identifyVariation(label: string, boxWidthPx: number, boxHeightPx: number, catalog: Item[]): Item | null {
    const variations = catalog.filter(item => item.label === label);

    if (variations.length === 0) {
      // Fallback: busca por nome quando label não está cadastrado
      const normalized = label.replace(/_/g, ' ').toLowerCase();
      return catalog.find(item =>
        item.nome.toLowerCase().includes(normalized) ||
        normalized.includes(item.nome.toLowerCase())
      ) ?? null;
    }

    if (this.ppcm === 0) return variations[variations.length - 1];

    const boxWidthCm = boxWidthPx / this.ppcm;
    const boxHeightCm = boxHeightPx / this.ppcm;
    const largestBoxSide = Math.max(boxWidthCm, boxHeightCm);
    const tolerance = 2.5;

    for (const product of variations) {
      if (!product.comprimento || !product.largura) continue;
      const productDiagonal = this.getDiagonal(product.comprimento, product.largura);
      const productLargestSide = Math.max(product.comprimento, product.largura);

      const isWithinUpperLimit = largestBoxSide <= (productDiagonal + tolerance);
      const isWithinLowerLimit = largestBoxSide >= (productLargestSide - tolerance);

      if (isWithinUpperLimit && isWithinLowerLimit) {
        return product;
      }
    }

    return variations[variations.length - 1];
  }
}
