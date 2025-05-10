export interface User {
  id: string
  name: string
  surname: string
  username: string
  email: string
  phone: string
}

export enum Status {
  PENDING = 'PENDING',
  CLOSED = 'CLOSED',
}

export enum Color {
  BLACK = 'BLACK',
  WHITE = 'WHITE',
  GREY = 'GREY',
  RED = 'RED',
  BLUE = 'BLUE',
  GREEN = 'GREEN',
  YELLOW = 'YELLOW',
  ORANGE = 'ORANGE',
  PURPLE = 'PURPLE',
  BROWN = 'BROWN',
  PINK = 'PINK',
  BEIGE = 'BEIGE',
  GOLD = 'GOLD',
  SILVER = 'SILVER',
}
export enum ApprovalType {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
}
export enum Category {
  ELECTRONICS = 'ELECTRONICS',
  WALLET = 'WALLET',
  KEYS = 'KEYS',
  DOCUMENTS = 'DOCUMENTS',
  BAG = 'BAG',
  CLOTHING = 'CLOTHING',
  JEWELRY = 'JEWELRY',
  PET = 'PET',
  OTHER = 'OTHER',
}

export interface ReportedItem {
  id: string
  title: string
  description: string
  location: string
  status: Status
  category: Category
  color: Color
  userId: string
  imageUrls: [string]
}

export interface FoundItem extends ReportedItem {
  dateFound: string
}
export interface LostItem extends ReportedItem {
  dateLost: string
}

export enum modalType {
  FOUND = 'FOUND',
  LOST = 'LOST',
}

export enum Approval {
  NOT_REVIEWED = 'NOT_REVIEWED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum ReviewStatus {
  IN_REVIEW = 'IN_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}
export interface Review {
  id: string
  matchId: string
  lostItemId: string
  foundItemId: string
  lostItemOwnerId: string
  foundItemOwnerId: string
  loserApproval: Approval
  founderApproval: Approval
  status: ReviewStatus
  matchedAt: string
}
