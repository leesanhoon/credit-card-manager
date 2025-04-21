import { NextResponse } from 'next/server'
import { updateCard, deleteCard } from '@/lib/data'
import { CreditCard } from '@/types'

// PUT /api/cards/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cardData: Omit<CreditCard, 'id' | 'createdAt' | 'updatedAt'> = await request.json()
    
    const updatedCardData: CreditCard = {
      ...cardData,
      id: params.id,
      createdAt: new Date(), // Sẽ được ghi đè bởi dữ liệu hiện có
      updatedAt: new Date()
    }

    const result = await updateCard(params.id, updatedCardData)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in PUT /api/cards/[id]:', error)
    return NextResponse.json(
      { error: 'Không thể cập nhật thẻ' },
      { status: 500 }
    )
  }
}

// DELETE /api/cards/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await deleteCard(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/cards/[id]:', error)
    return NextResponse.json(
      { error: 'Không thể xóa thẻ' },
      { status: 500 }
    )
  }
}