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
        } catch (error) {
          console.error('Invalid payment date:', payment.paymentDate)
          paymentDate = new Date() // Fallback to current date
        }

        return (
          <div
            key={payment.id}
            className="bg-white rounded-lg border p-4"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-semibold text-lg text-gray-900 mb-1">
                  {formatCurrency(payment.amount)}
                </div>
                <div className="text-base text-gray-600">
                  {formatDate(paymentDate)}
                </div>
              </div>
              <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${statusColors[payment.status]}`}>
                {statusText[payment.status]}
              </div>
            </div>
            {payment.notes && (
              <div className="text-base text-gray-600 mt-2">
                {payment.notes}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}