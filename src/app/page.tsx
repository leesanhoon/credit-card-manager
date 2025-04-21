'use client'

import { useEffect, useState } from 'react'
import { CreditCard, PaymentStatus } from '@/types'
import CreditCardItem from '@/components/CreditCardItem'
import CreditCardForm from '@/components/CreditCardForm'
import { cardService } from '@/services/cardService'

interface CardPaymentStatus {
  [cardId: string]: PaymentStatus
}

export default function Home() {
  const [cards, setCards] = useState<CreditCard[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingCard, setEditingCard] = useState<CreditCard | undefined>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [paymentStatuses, setPaymentStatuses] = useState<CardPaymentStatus>({})

  useEffect(() => {
    loadCards()
  }, [])

  const loadCards = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await cardService.getCards()
      setCards(data)
      
      // Initialize payment statuses
      const initialStatuses: CardPaymentStatus = {}
      data.forEach(card => {
        initialStatuses[card.id] = card.currentBalance === 0 
          ? PaymentStatus.COMPLETED 
          : PaymentStatus.PENDING
      })
      setPaymentStatuses(initialStatuses)
    } catch (err) {
      setError('Không thể tải danh sách thẻ')
      console.error('Error loading cards:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCard = async (cardData: Omit<CreditCard, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null)
      const newCard = await cardService.addCard(cardData)
      setCards(prev => [...prev, newCard])
      setPaymentStatuses(prev => ({
        ...prev,
        [newCard.id]: PaymentStatus.PENDING
      }))
      setShowForm(false)
    } catch (err) {
      setError('Không thể thêm thẻ mới')
      console.error('Error adding card:', err)
    }
  }

  const handleEditCard = async (cardData: Omit<CreditCard, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingCard) return
    
    try {
      setError(null)
      const updatedCard = await cardService.updateCard(editingCard.id, cardData)
      setCards(prev => prev.map(card => 
        card.id === editingCard.id ? updatedCard : card
      ))
      setEditingCard(undefined)
    } catch (err) {
      setError('Không thể cập nhật thẻ')
      console.error('Error updating card:', err)
    }
  }

  const handleDeleteCard = async (cardId: string) => {
    try {
      setError(null)
      await cardService.deleteCard(cardId)
      setCards(prev => prev.filter(card => card.id !== cardId))
      setPaymentStatuses(prev => {
        const newStatuses = { ...prev }
        delete newStatuses[cardId]
        return newStatuses
      })
    } catch (err) {
      setError('Không thể xóa thẻ')
      console.error('Error deleting card:', err)
    }
  }

  const handleUpdatePaymentStatus = async (cardId: string, status: PaymentStatus) => {
    try {
      setError(null)
      await cardService.updatePaymentStatus(cardId, status)
      
      setPaymentStatuses(prev => ({
        ...prev,
        [cardId]: status
      }))
      
      // Nếu đã thanh toán, cập nhật số dư về 0
      if (status === PaymentStatus.COMPLETED) {
        setCards(prev => prev.map(card => 
          card.id === cardId 
            ? { ...card, currentBalance: 0 }
            : card
        ))
      }
    } catch (err) {
      setError('Không thể cập nhật trạng thái thanh toán')
      console.error('Error updating payment status:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Đang tải...</div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-base">
            {error}
          </div>
        )}

        {/* Phần tổng quan */}
        <section className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-blue-600 font-medium mb-1">Tổng số thẻ</p>
            <p className="text-2xl font-bold text-blue-700">{cards.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-yellow-600 font-medium mb-1">Cần thanh toán</p>
            <p className="text-2xl font-bold text-yellow-700">
              {cards.filter(card => paymentStatuses[card.id] === PaymentStatus.PENDING).length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm col-span-2 sm:col-span-1">
            <p className="text-sm text-green-600 font-medium mb-1">Đã thanh toán</p>
            <p className="text-2xl font-bold text-green-700">
              {cards.filter(card => paymentStatuses[card.id] === PaymentStatus.COMPLETED).length}
            </p>
          </div>
        </section>

        {/* Danh sách thẻ */}
        <section className="space-y-3">
          {cards.map(card => (
            <CreditCardItem
              key={card.id}
              card={card}
              onEdit={setEditingCard}
              onDelete={handleDeleteCard}
              onUpdatePaymentStatus={handleUpdatePaymentStatus}
              paymentStatus={paymentStatuses[card.id]}
            />
          ))}

          {cards.length === 0 && !showForm && (
            <div className="bg-white rounded-lg p-6 text-center">
              <p className="text-base text-gray-500">
                Bạn chưa có thẻ tín dụng nào. Hãy thêm thẻ để bắt đầu quản lý.
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Nút thêm thẻ cố định ở bottom */}
      {!showForm && !editingCard && (
        <div className="fixed bottom-6 right-4 left-4">
          <button 
            onClick={() => setShowForm(true)}
            className="w-full bg-blue-600 text-white rounded-lg px-4 py-3 text-base font-medium shadow-lg hover:bg-blue-700 transition-colors"
          >
            Thêm thẻ mới
          </button>
        </div>
      )}

      {/* Form thêm/sửa thẻ */}
      {(showForm || editingCard) && (
        <CreditCardForm
          card={editingCard}
          onSubmit={editingCard ? handleEditCard : handleAddCard}
          onCancel={() => {
            setShowForm(false)
            setEditingCard(undefined)
          }}
        />
      )}
    </>
  )
}
