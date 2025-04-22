import useSWR, { mutate } from 'swr'
import { Payment } from '@/types'
import { cardService } from '@/services/cardService'

export function usePayments(cardId: string) {
  const key = cardId ? `/api/cards/${cardId}/payments` : null

  const { data: payments = [], error, isLoading } = useSWR<Payment[]>(
    key,
    () => cardService.getPaymentHistory(cardId)
  )

  const addPayment = async (amount: number) => {
    try {
      const result = await cardService.addPayment(cardId, amount)
      // Revalidate data sau khi thêm payment
      mutate(key)
      return result
    } catch (error) {
      throw error
    }
  }

  return {
    payments,
    error,
    isLoading,
    addPayment,
    hasHistory: payments.length > 0
  }
}