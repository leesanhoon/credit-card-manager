export interface CreditCard {
  id: string
  name: string
  statementDate: number
  dueDate: number
  creditLimit: number
  paymentStatus: PaymentStatus
  createdAt: Date
  updatedAt: Date
}

export interface Payment {
  id: string
  cardId: string
  amount: number
  paymentDate: Date
  status: PaymentStatus
  verificationStatus: VerificationStatus
  verificationDate?: Date
  verifiedBy?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export enum VerificationStatus {
  UNVERIFIED = 'unverified',
  VERIFIED = 'verified',
  REJECTED = 'rejected'
}

export interface PaymentHistory {
  cardId: string
  payments: Payment[]
  totalPaid: number
  lastPaymentDate?: Date
  lastPaymentStatus?: PaymentStatus
}