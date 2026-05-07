import { ExtendedColetaItem } from '@/hooks/useCheckoutAI';

export class CheckoutService {
  private static API_URL = 'https://api.scancount.com/checkout/verificacao';

  static async submitVerification(items: ExtendedColetaItem[]): Promise<any> {
    const response = await fetch(this.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(items),
    });

    if (!response.ok) {
      throw new Error('Falha ao enviar conferência');
    }

    return response.json();
  }
}
