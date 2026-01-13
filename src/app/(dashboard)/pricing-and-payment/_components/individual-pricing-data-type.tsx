export interface IndividualPlayerRevenueApiResponse {
  statusCode: number
  success: boolean
  message: string
  data: PlayerRevenueData
}

export interface PlayerRevenueData {
  totalRevenue: number
  totalPayments: number
  players: PlayerRevenueItem[]
  meta: Meta
}

export interface PlayerRevenueItem {
  totalRevenue: number
  totalPayments: number
  player: PlayerInfo
}

export interface PlayerInfo {
  id: string
  name: string
  email: string
  teamName: string
  category: string
  league: string
}

export interface Meta {
  total: number
  page: number
  limit: number
}
