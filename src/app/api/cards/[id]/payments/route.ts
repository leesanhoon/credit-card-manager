import { NextResponse } from 'next/server'
import { Payment, PaymentStatus, VerificationStatus } from '@/types'
import { getCardPayments, addPayment } from '@/lib/data'

// GET /api/cards/[id]/payments
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const payments = await getCardPayments(params.id)
    return NextResponse.json(payments)
  } catch (error) {
    console.error('Error getting payments:', error)
    return NextResponse.json(
      { error: 'Không thể tải lịch sử thanh toán' },
      { status: 500 }
    )
  }
}

// POST /api/cards/[id]/payments
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { amount }: { amount: number } = await request.json()
    
    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Số tiền thanh toán không hợp lệ' },
        { status: 400 }
      )
    }

    const payment: Payment = {
      id: Math.random().toString(36).substring(7),
      cardId: params.id,
      amount,
      paymentDate: new Date(),
      status: PaymentStatus.COMPLETED,
      verificationStatus: VerificationStatus.UNVERIFIED,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await addPayment(payment)
    return NextResponse.json(payment)
  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json(
      { error: 'Không thể tạo thanh toán mới' },
      { status: 500 }
    )
  }
}