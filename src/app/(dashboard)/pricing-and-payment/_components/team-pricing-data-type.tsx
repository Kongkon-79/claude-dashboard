export interface TeamRevenueApiResponse {
  statusCode: number
  success: boolean
  message: string
  data: TeamRevenueData
}

export interface TeamRevenueData {
  totalRevenue: number
  totalPayments: number
  teams: TeamRevenueItem[]
  meta: Meta
}

export interface TeamRevenueItem {
  totalRevenue: number
  totalPayments: number
  playersPaid: string[]
  team: TeamInfo
}

export interface TeamInfo {
  id: string
  teamName: string
  coachName: string
  coachEmail: string
  allPlayers: TeamPlayer[]
}

export interface TeamPlayer {
  _id: string
  name: string
  email: string
  role: "player" | "gk"
  usedGames: number
}

export interface Meta {
  total: number
  page: number
  limit: number
}
