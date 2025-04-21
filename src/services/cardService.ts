import { CreditCard, Payment, PaymentStatus } from '@/types'

export const cardService = {
  async getCards(): Promise<CreditCard[]> {
    const response = await fetch('/api/cards')
    if (!response.ok) {
      throw new Error('Không thể tải danh sách thẻ')
    }
    return response.json()
  },

  async addCard(card: Omit<CreditCard, 'id' | 'createdAt' | 'updatedAt'>): Promise<CreditCard> {
    const response = await fetch('/api/cards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(card),
    })
    
    if (!response.ok) {
      throw new Error('Không thể thêm thẻ mới')
    }
    return response.json()
  },

  async updateCard(
    id: string,
    card: Omit<CreditCard, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<CreditCard> {
    const response = await fetch(`/api/cards/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(card),
    })
    
    if (!response.ok) {
      throw new Error('Không thể cập nhật thẻ')
    }
    return response.json()
  },

  async deleteCard(id: string): Promise<void> {
    const response = await fetch(`/api/cards/${id}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error('Không thể xóa thẻ')
    }
  },

  async updatePaymentStatus(
    id: string, 
    status: PaymentStatus
  ): Promise<{ cardId: string; status: PaymentStatus; updatedAt: Date }> {
    const response = await fetch(`/api/cards/${id}/payment`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    })

    if (!response.ok) {
      throw new Error('Không thể cập nhật trạng thái thanh toán')
    }

    return response.json()
  },

  async getPaymentHistory(cardId: string): Promise<Payment[]> {
    const response = await fetch(`/api/cards/${cardId}/payments`)
    if (!response.ok) {
      throw new Error('Không thể tải lịch sử thanh toán')
    }
    return response.json()
  },

  async addPayment(cardId: string, amount: number): Promise<Payment> {
    const response = await fetch(`/api/cards/${cardId}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    })

    if (!response.ok) {
      throw new Error('Không thể thêm thanh toán mới')
    }

    return response.json()
  }
}