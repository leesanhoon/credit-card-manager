import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { Payment, PaymentStatus, VerificationStatus } from '@/types'

const paymentsFilePath = path.join(process.cwd(), 'src/data/payments.json')

async function initPaymentsFile() {
  try {
    await fs.access(paymentsFilePath)
  } catch {
    // Nếu file không tồn tại, tạo file mới với mảng rỗng
    await fs.writeFile(paymentsFilePath, JSON.stringify({ payments: [] }, null, 2))
  }
}

async function getPaymentsData() {
  await initPaymentsFile()
  try {
    const jsonData = await fs.readFile(paymentsFilePath, 'utf8')
    const data = JSON.parse(jsonData)
    if (!data.payments || !Array.isArray(data.payments)) {
      throw new Error('Invalid payments data structure')
    }
    return data
  } catch (error) {
    console.error('Error reading payments data:', error)
    return { payments: [] }
  }
}

async function savePaymentsData(data: { payments: Payment[] }) {
  try {
    await fs.writeFile(paymentsFilePath, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('Error saving payments data:', error)
    throw new Error('Không thể lưu dữ liệu thanh toán')
  }
}

// GET /api/cards/[id]/payments
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await getPaymentsData()
    const cardPayments = data.payments
      .filter((payment: Payment) => payment.cardId === params.id)
      .sort((a: Payment, b: Payment) => {
        return new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
      })
    return NextResponse.json(cardPayments)
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

    const data = await getPaymentsData()
    data.payments.push(payment)
    await savePaymentsData(data)

    return NextResponse.json(payment)
  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json(
      { error: 'Không thể tạo thanh toán mới' },
      { status: 500 }
    )
  }
}