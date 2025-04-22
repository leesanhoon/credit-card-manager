import useSWR, { mutate } from 'swr'
import { CreditCard, PaymentStatus } from '@/types'
import { cardService } from '@/services/cardService'

const CARDS_KEY = '/api/cards'

export function useCards() {
  const { data: cards = [], error, isLoading } = useSWR<CreditCard[]>(
    CARDS_KEY,
    () => cardService.getCards()
  )

  const addCard = async (cardData: Omit<CreditCard, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newCard = await cardService.addCard(cardData)
      // Revalidate data sau khi thêm
      mutate(CARDS_KEY)
      return newCard
    } catch (error) {
      throw error
    }
  }

  const updateCard = async (id: string, cardData: Omit<CreditCard, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const updatedCard = await cardService.updateCard(id, cardData)
      // Revalidate data sau khi cập nhật
      mutate(CARDS_KEY)
      return updatedCard
    } catch (error) {
      throw error
    }
  }

  const deleteCard = async (id: string) => {
    try {
      await cardService.deleteCard(id)
      // Revalidate data sau khi xóa
      mutate(CARDS_KEY)
    } catch (error) {
      throw error
    }
  }

  const updatePaymentStatus = async (id: string, status: PaymentStatus) => {
    try {
      const result = await cardService.updatePaymentStatus(id, status)
      // Revalidate data sau khi cập nhật trạng thái
      mutate(CARDS_KEY)
      return result
    } catch (error) {
      throw error
    }
  }

  return {
    cards,
    error,
    isLoading,
    addCard,
    updateCard,
    deleteCard,
    updatePaymentStatus
  }
}