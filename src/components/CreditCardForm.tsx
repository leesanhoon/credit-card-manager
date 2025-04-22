'use client'

import { CreditCard, PaymentStatus } from '@/types'
import { useState } from 'react'
import CurrencyInput from './CurrencyInput'
import DateInput from './DateInput'

interface CreditCardFormProps {
  card?: CreditCard
  onSubmit: (card: Omit<CreditCard, 'id' | 'createdAt' | 'updatedAt'>) => void
  onCancel: () => void
}

export default function CreditCardForm({ card, onSubmit, onCancel }: CreditCardFormProps) {
  const [formData, setFormData] = useState({
    name: card?.name || '',
    statementDate: card?.statementDate || 1,
    dueDate: card?.dueDate || 1,
    creditLimit: card?.creditLimit || 0,
    usedAmount: card?.usedAmount || 0,
    remainingAmount: card?.remainingAmount || 0,
    paymentStatus: card?.paymentStatus || PaymentStatus.PENDING
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleInputChange = (name: keyof typeof formData, value: string | number) => {
    setFormData(prev => {
      const newData = { ...prev };
      
      if (name === 'name') {
        newData.name = String(value);
      } else if (name === 'paymentStatus') {
        newData.paymentStatus = value as PaymentStatus;
      } else {
        // Các trường số
        newData[name] = Number(value);
      }
      
      // Tự động tính toán remainingAmount khi creditLimit hoặc usedAmount thay đổi
      if (name === 'creditLimit' || name === 'usedAmount') {
        const creditLimit = name === 'creditLimit' ? Number(value) : prev.creditLimit;
        const usedAmount = name === 'usedAmount' ? Number(value) : prev.usedAmount;
        newData.remainingAmount = creditLimit - usedAmount;
      }

      return newData;
    });
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
      <div className="bg-white rounded-t-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {card ? 'Sửa thẻ' : 'Thêm thẻ mới'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
          >
            <span className="sr-only">Đóng</span>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-base font-medium text-gray-900 mb-2">
                Tên thẻ
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                className="block w-full rounded-lg border border-gray-400 px-4 py-3 text-base text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="VD: Thẻ tín dụng chính"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="statementDate" className="block text-base font-medium text-gray-900 mb-2">
                  Ngày sao kê
                </label>
                <DateInput
                  id="statementDate"
                  name="statementDate"
                  value={formData.statementDate}
                  onChange={(value) => handleInputChange('statementDate', value)}
                  required
                  className="block w-full rounded-lg border border-gray-400 px-4 py-3 text-base text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="dueDate" className="block text-base font-medium text-gray-900 mb-2">
                  Ngày đến hạn
                </label>
                <DateInput
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={(value) => handleInputChange('dueDate', value)}
                  required
                  className="block w-full rounded-lg border border-gray-400 px-4 py-3 text-base text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="creditLimit" className="block text-base font-medium text-gray-900 mb-2">
                  Hạn mức tín dụng
                </label>
                <CurrencyInput
                  id="creditLimit"
                  name="creditLimit"
                  value={formData.creditLimit}
                  onChange={(value) => handleInputChange('creditLimit', value)}
                  required
                  min={0}
                  className="block w-full rounded-lg border border-gray-400 px-4 py-3 text-base text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="usedAmount" className="block text-base font-medium text-gray-900 mb-2">
                  Số tiền đã sử dụng
                </label>
                <CurrencyInput
                  id="usedAmount"
                  name="usedAmount"
                  value={formData.usedAmount}
                  onChange={(value) => handleInputChange('usedAmount', value)}
                  required
                  min={0}
                  max={formData.creditLimit}
                  className="block w-full rounded-lg border border-gray-400 px-4 py-3 text-base text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="remainingAmount" className="block text-base font-medium text-gray-900 mb-2">
                  Số tiền còn lại
                </label>
                <div className="block w-full rounded-lg border border-gray-400 px-4 py-3 text-base text-gray-900 bg-gray-50">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(formData.remainingAmount)}
                </div>
              </div>
            </div>

          </div>

          <div className="flex flex-col space-y-3 pt-4">
            <button
              type="submit"
              className="w-full px-4 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {card ? 'Cập nhật' : 'Thêm thẻ'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="w-full px-4 py-3 text-base font-medium text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}