'use client'

import { CreditCard, Payment, PaymentStatus } from '@/types'
import { formatCurrency } from '@/utils/format'
import { useState, useEffect } from 'react'
import { cardService } from '@/services/cardService'
import PaymentHistory from './PaymentHistory'

interface CreditCardItemProps {
  card: CreditCard
  onEdit: (card: CreditCard) => void
  onDelete: (cardId: string) => void
  onUpdatePaymentStatus: (cardId: string, status: PaymentStatus) => void
  paymentStatus?: PaymentStatus
}

export default function CreditCardItem({
  card,
  onEdit,
  onDelete,
  onUpdatePaymentStatus,
  paymentStatus = PaymentStatus.PENDING
}: CreditCardItemProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Vô hiệu hóa cuộn trang khi modal mở
  useEffect(() => {
    if (showHistory) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showHistory])

  const daysUntilDue = () => {
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

  const renderPaymentStatus = () => {
    const days = daysUntilDue()
    if (paymentStatus === PaymentStatus.COMPLETED) {
      return { text: 'Đã thanh toán', color: 'text-green-600 font-medium' }
    }
    if (days <= 0) {
      return { text: 'Quá hạn', color: 'text-red-600 font-medium' }
    }
    if (days <= 7) {
      return { text: 'Sắp đến hạn', color: 'text-yellow-600 font-medium' }
    }
    return { text: `Còn ${days} ngày`, color: 'text-blue-600 font-medium' }
  }

  const handlePaymentStatusChange = async () => {
    try {
      setIsUpdating(true)
      setError(null)
      const newStatus = paymentStatus === PaymentStatus.COMPLETED
        ? PaymentStatus.PENDING
        : PaymentStatus.COMPLETED
      await onUpdatePaymentStatus(card.id, newStatus)
      
      if (newStatus === PaymentStatus.COMPLETED) {
        await cardService.addPayment(card.id, card.currentBalance)
      }
    } catch (err) {
      setError('Không thể cập nhật trạng thái thanh toán')
      console.error('Error updating payment status:', err)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleViewHistory = async () => {
    try {
      setLoading(true)
      setError(null)
      const history = await cardService.getPaymentHistory(card.id)
      setPayments(history)
      setShowHistory(true)
    } catch (err) {
      setError('Không thể tải lịch sử thanh toán')
      console.error('Error loading payment history:', err)
    } finally {
      setLoading(false)
    }
  }

  const status = renderPaymentStatus()

  return (
    <>
      <div className="border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
        <div 
          className="p-4 cursor-pointer active:bg-gray-50"
          onClick={handlePaymentStatusChange}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={paymentStatus === PaymentStatus.COMPLETED}
                onChange={() => {}} // Handled by parent div click
                disabled={isUpdating}
                className="w-6 h-6 rounded border-gray-400 text-blue-600 focus:ring-blue-500"
              />
              <h3 className="text-lg font-semibold text-gray-900">{card.name}</h3>
            </div>
            <div className={`text-sm ${status.color} px-2 py-1 rounded-full bg-opacity-10`}>
              {status.text}
            </div>
          </div>

          <div className="ml-9">
            <p className="text-base font-medium text-gray-800 mb-3">
              Ngày đến hạn: {card.dueDate}
            </p>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-base text-gray-800">Số dư hiện tại</span>
                <span className="font-semibold text-gray-900">{formatCurrency(card.currentBalance)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base text-gray-800">Hạn mức tín dụng</span>
                <span className="font-semibold text-gray-900">{formatCurrency(card.creditLimit)}</span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="px-4 py-2 bg-red-50 border-t border-red-100">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="px-4 py-3 border-t flex justify-end space-x-3">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleViewHistory()
            }}
            className="px-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors min-w-[80px] relative"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="opacity-0">Lịch sử</span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="loading-spinner w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
                </div>
              </>
            ) : (
              'Lịch sử'
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit(card)
            }}
            className="px-4 py-2 text-base font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors min-w-[80px]"
          >
            Sửa
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(card.id)
            }}
            className="px-4 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors min-w-[80px]"
          >
            Xóa
          </button>
        </div>
      </div>

      {showHistory && (
        <div className="fixed inset-0 z-50">
          <div 
            className="modal-overlay absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowHistory(false)}
          />
          <div className="modal-content fixed bottom-0 inset-x-0 bg-white rounded-t-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white pb-4 mb-4 border-b px-4 pt-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">Lịch sử thanh toán</h3>
              <button
                onClick={() => setShowHistory(false)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
              >
                <span className="sr-only">Đóng</span>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-4 pb-4">
              <PaymentHistory payments={payments} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}