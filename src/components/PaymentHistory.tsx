'use client'

import { Payment, PaymentStatus } from '@/types'
import { formatCurrency, formatDate } from '@/utils/format'

interface PaymentHistoryProps {
  payments: Payment[]
}

const statusColors = {
  [PaymentStatus.COMPLETED]: 'bg-green-100 text-green-700',
  [PaymentStatus.PENDING]: 'bg-yellow-100 text-yellow-700',
  [PaymentStatus.FAILED]: 'bg-red-100 text-red-700',
}

const statusText = {
  [PaymentStatus.COMPLETED]: 'Đã thanh toán',
  [PaymentStatus.PENDING]: 'Đang chờ',
  [PaymentStatus.FAILED]: 'Thất bại',
}

export default function PaymentHistory({ payments }: PaymentHistoryProps) {
  if (!Array.isArray(payments)) {
    console.error('Invalid payments data:', payments)
    return (
      <div className="text-center py-8">
        <p className="text-base text-red-500">Đã có lỗi xảy ra khi tải lịch sử thanh toán</p>
      </div>
    )
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-base text-gray-500">Chưa có lịch sử thanh toán</p>
      </div>
    )
  }

  const sortedPayments = [...payments].sort((a, b) => {
    return new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
  })

  return (
    <div className="space-y-3">
      {sortedPayments.map((payment) => {
        // Kiểm tra và xử lý ngày thanh toán
        let paymentDate
        try {
          paymentDate = new Date(payment.paymentDate)
          if (isNaN(paymentDate.getTime())) {
            throw new Error('Invalid date')
          }
        } catch {
          console.error('Invalid payment date:', payment.paymentDate)
          paymentDate = new Date() // Fallback to current date
        }

        return (
          <div
            key={payment.id}
            className="bg-white rounded-lg border p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold text-lg text-gray-900">
                  {formatCurrency(payment.amount)}
                </div>
                <div className="text-sm text-gray-500 space-y-1 mt-2">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{formatDate(paymentDate)}</span>
                  </div>
                </div>
              </div>
              <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${statusColors[payment.status]}`}>
                {statusText[payment.status]}
              </div>
            </div>
            {payment.notes && (
              <div className="text-sm text-gray-600 mt-3 border-t pt-3">
                {payment.notes}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}