import { promises as fs } from 'fs'
import path from 'path'
import { CreditCard } from '@/types'

let cachedCards: CreditCard[] | null = null

export async function getCards(): Promise<CreditCard[]> {
  if (cachedCards) {
    return cachedCards
  }

  try {
    const filePath = process.env.CARDS_FILE_PATH || 'src/data/cards.json'
    const fullPath = path.join(process.cwd(), filePath)
    
    try {
      await fs.access(fullPath)
    } catch {
      // Nếu file không tồn tại, tạo file mới với mảng rỗng
      await fs.writeFile(fullPath, JSON.stringify({ cards: [] }, null, 2))
    }

    const jsonData = await fs.readFile(fullPath, 'utf8')
    const data = JSON.parse(jsonData)
    cachedCards = data.cards
    return data.cards
  } catch (error) {
    console.error('Error reading cards:', error)
    return []
  }
}

export async function saveCards(cards: CreditCard[]): Promise<void> {
  try {
    const filePath = process.env.CARDS_FILE_PATH || 'src/data/cards.json'
    const fullPath = path.join(process.cwd(), filePath)
    await fs.writeFile(fullPath, JSON.stringify({ cards }, null, 2))
    cachedCards = cards
  } catch (error) {
    console.error('Error saving cards:', error)
    throw new Error('Không thể lưu dữ liệu')
  }
}

export async function addCard(card: CreditCard): Promise<CreditCard> {
  const cards = await getCards()
  cards.push(card)
  await saveCards(cards)
  return card
}

export async function updateCard(id: string, updatedCard: CreditCard): Promise<CreditCard> {
  const cards = await getCards()
  const index = cards.findIndex(card => card.id === id)
  if (index === -1) {
    throw new Error('Không tìm thấy thẻ')
  }
  cards[index] = updatedCard
  await saveCards(cards)
  return updatedCard
}

export async function deleteCard(id: string): Promise<void> {
  const cards = await getCards()
  const filteredCards = cards.filter(card => card.id !== id)
  await saveCards(filteredCards)
}