import { NextResponse } from 'next/server'
import { PaymentStatus } from '@/types'
import { getCards, saveCards } from '@/lib/data'

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
    const cardIndex = cards.findIndex(card => card.id === params.id)
    
    if (cardIndex === -1) {
      return NextResponse.json(
        { error: 'Không tìm thấy thẻ' },
        { status: 404 }
      )
    }

    // Update payment status and balance
    if (status === PaymentStatus.COMPLETED) {
      cards[cardIndex].currentBalance = 0
    }

    await saveCards(cards)

    return NextResponse.json({ 
      cardId: params.id,
      status,
      updatedAt: new Date()
    })
  } catch (error) {
    console.error('Error updating payment status:', error)
    return NextResponse.json(
      { error: 'Không thể cập nhật trạng thái thanh toán' },
      { status: 500 }
    )
  }
}