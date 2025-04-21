import { NextResponse } from 'next/server'
import { getCards, addCard } from '@/lib/data'
import { CreditCard } from '@/types'

// GET /api/cards
export async function GET() {
  try {
    const cards = await getCards()
    return NextResponse.json(cards)
  } catch (error) {
    console.error('Error in GET /api/cards:', error)
    return NextResponse.json(
      { error: 'Không thể đọc dữ liệu' },
      { status: 500 }
    )
  }
}

// POST /api/cards
export async function POST(request: Request) {
  try {
    const cardData: Omit<CreditCard, 'id' | 'createdAt' | 'updatedAt'> = await request.json()
    
    const newCard: CreditCard = {
      ...cardData,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    await addCard(newCard)
    return NextResponse.json(newCard)
  } catch (error) {
    console.error('Error in POST /api/cards:', error)
    return NextResponse.json(
      { error: 'Không thể thêm thẻ mới' },
      { status: 500 }
    )
  }
}