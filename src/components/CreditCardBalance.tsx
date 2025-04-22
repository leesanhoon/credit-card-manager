'use client'

import { CreditCard } from '@/types'
import { formatCurrency } from '@/utils/format'

interface CreditCardBalanceProps {
  cards: CreditCard[]
}

export default function CreditCardBalance({ cards }: CreditCardBalanceProps) {
  // Tính tổng số dư có thể sử dụng
  const totalBalance = cards.reduce((sum, card) => sum + card.remainingAmount, 0)
  
  // Sắp xếp thẻ theo số dư giảm dần
  const sortedCards = [...cards].sort((a, b) => b.remainingAmount - a.remainingAmount)

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Số dư khả dụng</h3>
        <p className="text-2xl font-bold text-blue-600">
          {formatCurrency(totalBalance)}
        </p>
      </div>

      <div className="space-y-4">
        {sortedCards.map(card => {
          // Tính phần trăm số dư so với hạn mức
          const percentage = (card.remainingAmount / card.creditLimit) * 100
          
          return (
            <div key={card.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-700">{card.name}</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatCurrency(card.remainingAmount)}
                </p>
              </div>
              
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              
              <div className="flex justify-between items-center text-xs text-gray-500">
                <p>{percentage.toFixed(1)}% còn lại</p>
                <p>Hạn mức: {formatCurrency(card.creditLimit)}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}