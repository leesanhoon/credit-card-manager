import { CreditCard, Payment, PaymentStatus } from '@/types'
import { jsonbinService } from '@/services/jsonbinService'
import { JSONBIN_CONFIG } from '@/config/jsonbin'

export async function getCards(): Promise<CreditCard[]> {
  const cards = await jsonbinService.getData(JSONBIN_CONFIG.CARDS_BIN_ID)
  return cards || []
}

export async function addCard(card: CreditCard): Promise<void> {
  const cards = await getCards()
  cards.push(card)
  await jsonbinService.updateData(JSONBIN_CONFIG.CARDS_BIN_ID, cards)
}

export async function updateCard(id: string, updatedCard: CreditCard): Promise<void> {
  const cards = await getCards()
  const index = cards.findIndex(card => card.id === id)
  if (index === -1) throw new Error('Không tìm thấy thẻ')
  
  cards[index] = {
    ...updatedCard,
    updatedAt: new Date()
  }
  await jsonbinService.updateData(JSONBIN_CONFIG.CARDS_BIN_ID, cards)
}

export async function deleteCard(id: string): Promise<void> {
  const cards = await getCards()
  const updatedCards = cards.filter(card => card.id !== id)
  await jsonbinService.updateData(JSONBIN_CONFIG.CARDS_BIN_ID, updatedCards)
}

export async function getPayments(): Promise<Payment[]> {
  const payments = await jsonbinService.getData(JSONBIN_CONFIG.PAYMENTS_BIN_ID)
  return payments || []
}

export async function addPayment(payment: Payment): Promise<void> {
  const payments = await getPayments()
  payments.push(payment)
  await jsonbinService.updateData(JSONBIN_CONFIG.PAYMENTS_BIN_ID, payments)
}

export async function getCardPayments(cardId: string): Promise<Payment[]> {
  const payments = await getPayments()
  return payments.filter(payment => payment.cardId === cardId)
}

export async function updatePaymentStatus(cardId: string, status: PaymentStatus): Promise<void> {
  const cards = await getCards()
  const card = cards.find(c => c.id === cardId)
  if (!card) throw new Error('Không tìm thấy thẻ')
  
  card.paymentStatus = status
  card.updatedAt = new Date()
  await updateCard(cardId, card)
}