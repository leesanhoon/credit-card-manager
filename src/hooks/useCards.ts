import useSWR, { mutate } from 'swr'
import { CreditCard, PaymentStatus } from '@/types'
import { cardService } from '@/services/cardService'
import { useState } from 'react'

type ActionState = {
  isAdding: boolean
  isUpdating: string | null
  isDeleting: string | null
  isUpdatingStatus: string | null
}

const CARDS_KEY = '/api/cards'

export function useCards() {
  const [actionState, setActionState] = useState<ActionState>({
    isAdding: false,
    isUpdating: null,
    isDeleting: null,
    isUpdatingStatus: null
  })

  const { data: cards = [], error, isLoading } = useSWR<CreditCard[]>(
    CARDS_KEY,
    () => cardService.getCards()
  )

  const addCard = async (cardData: Omit<CreditCard, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setActionState(prev => ({ ...prev, isAdding: true }))
      const newCard = await cardService.addCard(cardData)
      await mutate(CARDS_KEY)
      return newCard
    } catch (error) {
      throw error
    } finally {
      setActionState(prev => ({ ...prev, isAdding: false }))
    }
  }

  const updateCard = async (id: string, cardData: Omit<CreditCard, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setActionState(prev => ({ ...prev, isUpdating: id }))
      const updatedCard = await cardService.updateCard(id, cardData)
      await mutate(CARDS_KEY)
      return updatedCard
    } catch (error) {
      throw error
    } finally {
      setActionState(prev => ({ ...prev, isUpdating: null }))
    }
  }

  const deleteCard = async (id: string) => {
    try {
      setActionState(prev => ({ ...prev, isDeleting: id }))
      await cardService.deleteCard(id)
      await mutate(CARDS_KEY)
    } catch (error) {
      throw error
    } finally {
      setActionState(prev => ({ ...prev, isDeleting: null }))
    }
  }

  const updatePaymentStatus = async (id: string, status: PaymentStatus) => {
    try {
      setActionState(prev => ({ ...prev, isUpdatingStatus: id }))
      const result = await cardService.updatePaymentStatus(id, status)
      await mutate(CARDS_KEY)
      return result
    } catch (error) {
      throw error
    } finally {
      setActionState(prev => ({ ...prev, isUpdatingStatus: null }))
    }
  }

  return {
    cards,
    error,
    isLoading,
    addCard,
    updateCard,
    deleteCard,
    updatePaymentStatus,
    isAdding: actionState.isAdding,
    isUpdating: actionState.isUpdating,
    isDeleting: actionState.isDeleting,
    isUpdatingStatus: actionState.isUpdatingStatus
  }
}