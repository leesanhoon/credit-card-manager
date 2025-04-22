'use client'

import { useEffect, useState } from 'react'
import { CreditCard, PaymentStatus } from '@/types'
import CreditCardItem from '@/components/CreditCardItem'
import CreditCardForm from '@/components/CreditCardForm'
import CreditCardBalance from '@/components/CreditCardBalance'
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
        initialStatuses[card.id] = card.paymentStatus
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
      
      // Cập nhật trạng thái thanh toán của thẻ
      setCards(prev => prev.map(card =>
        card.id === cardId
          ? { ...card, paymentStatus: status }
          : card
      ))
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
        <section className="space-y-4">
          {/* Thông tin thanh toán */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-xl shadow-lg text-white">
              <p className="text-sm font-medium mb-2 opacity-90">Số tiền cần thanh toán</p>
              <p className="text-3xl font-bold">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                  .format(cards
                    .filter(card => paymentStatuses[card.id] === PaymentStatus.PENDING)
                    .reduce((sum, card) => sum + card.usedAmount, 0)
                  )}
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
              <p className="text-sm font-medium mb-2 opacity-90">Tổng số tiền nợ</p>
              <p className="text-3xl font-bold">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                  .format(cards
                    .filter(card => paymentStatuses[card.id] === PaymentStatus.PENDING)
                    .reduce((sum, card) => sum + card.usedAmount, 0))}
              </p>
            </div>
          </div>

          {/* Tổng số tiền còn lại */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
            <p className="text-sm font-medium mb-2 opacity-90">Tổng số tiền còn lại</p>
            <p className="text-3xl font-bold">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                .format(cards.reduce((sum, card) => sum + card.remainingAmount, 0))}
            </p>
          </div>

          {/* Thống kê số lượng thẻ */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="flex divide-x divide-gray-200">
              <div className="flex-1 p-4 text-center">
                <p className="text-sm text-blue-600 font-medium whitespace-nowrap">Tổng số thẻ</p>
                <p className="mt-1 text-2xl font-bold text-blue-700">{cards.length}</p>
              </div>
              <div className="flex-1 p-4 text-center">
                <p className="text-sm text-yellow-600 font-medium whitespace-nowrap">Cần thanh toán</p>
                <p className="mt-1 text-2xl font-bold text-yellow-700">
                  {cards.filter(card => paymentStatuses[card.id] === PaymentStatus.PENDING).length}
                </p>
              </div>
              <div className="flex-1 p-4 text-center">
                <p className="text-sm text-green-600 font-medium whitespace-nowrap">Đã thanh toán</p>
                <p className="mt-1 text-2xl font-bold text-green-700">
                  {cards.filter(card => paymentStatuses[card.id] === PaymentStatus.COMPLETED).length}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Danh sách thẻ */}
        <section className="space-y-3">
          {cards.sort((a, b) => {
            const statusA = paymentStatuses[a.id]
            const statusB = paymentStatuses[b.id]
            
            // Đã thanh toán xếp cuối
            if (statusA === PaymentStatus.COMPLETED && statusB !== PaymentStatus.COMPLETED) return 1
            if (statusB === PaymentStatus.COMPLETED && statusA !== PaymentStatus.COMPLETED) return -1
            
            // Tính số ngày còn lại
            const getDaysUntilDue = (card: CreditCard) => {
              const today = new Date()
              const currentMonth = today.getMonth()
              const currentYear = today.getFullYear()
              const dueDate = new Date(currentYear, currentMonth, card.dueDate)
              
              if (today > dueDate) {
                dueDate.setMonth(dueDate.getMonth() + 1)
              }
              
              const diffTime = dueDate.getTime() - today.getTime()
              return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            }

            const daysA = getDaysUntilDue(a)
            const daysB = getDaysUntilDue(b)

            // Sắp xếp theo số ngày còn lại (ít ngày hơn lên trên)
            return daysA - daysB
          }).map(card => (
            <CreditCardItem
              key={card.id}
              card={card}
              onEdit={setEditingCard}
              onDelete={handleDeleteCard}
              onUpdatePaymentStatus={handleUpdatePaymentStatus}
              paymentStatus={paymentStatuses[card.id]}
              totalCards={cards.length}
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

        {/* Biểu đồ số dư từng thẻ */}
        {cards.length > 0 && (
          <section className="mt-6">
            <CreditCardBalance cards={cards} />
          </section>
        )}
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
