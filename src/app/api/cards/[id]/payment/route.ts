import { NextResponse } from 'next/server'
import { PaymentStatus } from '@/types'
import { getCards, updateCard } from '@/lib/data'

// PUT /api/cards/[id]/payment
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status }: { status: PaymentStatus } = await request.json()
    
    // Validate status
    if (!Object.values(PaymentStatus).includes(status)) {
      return NextResponse.json(
        { error: 'Trạng thái thanh toán không hợp lệ' },
        { status: 400 }
      )
    }

    const cards = await getCards()
    const card = cards.find(c => c.id === params.id)
    
    if (!card) {
      return NextResponse.json(
        { error: 'Không tìm thấy thẻ' },
        { status: 404 }
      )
    }

    // Update payment status and balance
    const updatedCard = {
      ...card,
      paymentStatus: status,
      currentBalance: status === PaymentStatus.COMPLETED ? 0 : card.creditLimit,
      updatedAt: new Date()
    }

    await updateCard(params.id, updatedCard)

    return NextResponse.json({
      cardId: params.id,
      status,
      updatedAt: updatedCard.updatedAt
    })
  } catch (error) {
    console.error('Error updating payment status:', error)
    return NextResponse.json(
      { error: 'Không thể cập nhật trạng thái thanh toán' },
      { status: 500 }
    )
  }
}