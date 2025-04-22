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
  totalCards: number // Thêm prop mới để biết tổng số thẻ
}

export default function CreditCardItem({
  card,
  onEdit,
  onDelete,
  onUpdatePaymentStatus,
  paymentStatus = PaymentStatus.PENDING,
  totalCards
}: CreditCardItemProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasHistory, setHasHistory] = useState(false)

  // Kiểm tra lịch sử thanh toán khi component mount
  useEffect(() => {
    const checkPaymentHistory = async () => {
      try {
        const history = await cardService.getPaymentHistory(card.id)
        setHasHistory(history.length > 0)
      } catch (err) {
        console.error('Error checking payment history:', err)
        setHasHistory(false)
      }
    }
    checkPaymentHistory()
  }, [card.id])

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
      return { text: 'Đã thanh toán', color: 'bg-green-100 text-green-700' }
    }
    if (days <= 0) {
      return { text: 'Quá hạn', color: 'bg-red-100 text-red-700' }
    }
    if (days <= 7) {
      return { text: 'Sắp đến hạn', color: 'bg-yellow-100 text-yellow-700' }
    }
    return { text: `Còn ${days} ngày`, color: 'bg-blue-100 text-blue-700' }
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
        await cardService.addPayment(card.id, card.creditLimit)
        // Cập nhật trạng thái lịch sử
        setHasHistory(true)
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
      <div className="border rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
        <div className="relative">

          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {/* Chỉ hiển thị nút thanh toán khi số tiền sử dụng > 0 và chưa thanh toán */}
                {card.usedAmount > 0 && paymentStatus === PaymentStatus.PENDING && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isUpdating) {
                        handlePaymentStatusChange();
                      }
                    }}
                    disabled={isUpdating}
                    className={`w-6 h-6 rounded border bg-white border-gray-300 hover:border-blue-500 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  />
                )}
                <h3 className={`text-xl font-semibold text-gray-900 ${card.usedAmount === 0 || paymentStatus === PaymentStatus.COMPLETED ? 'ml-9' : ''}`}>{card.name}</h3>
              </div>
              <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${status.color}`}>
                {status.text}
              </div>
            </div>

            <div className="ml-9 space-y-4">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-base text-gray-600">
                  Ngày đến hạn: <span className="font-semibold text-gray-900">{card.dueDate}</span>
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Hạn mức tín dụng</span>
                  <span className="text-lg font-semibold text-gray-900">{formatCurrency(card.creditLimit)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Số tiền đã sử dụng</span>
                  <span className="text-lg font-semibold text-red-600">{formatCurrency(card.usedAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Số tiền còn lại</span>
                  <span className="text-lg font-semibold text-green-600">{formatCurrency(card.remainingAmount)}</span>
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
            {hasHistory && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleViewHistory()
                }}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors relative"
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
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Lịch sử</span>
                  </div>
                )}
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit(card)
              }}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Sửa
            </button>
            {/* Chỉ hiển thị nút xóa khi có nhiều hơn 1 thẻ */}
            {totalCards > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(card.id)
                }}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Xóa
              </button>
            )}
          </div>
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