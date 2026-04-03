export interface ShortUrl {
  id: string
  originalUrl: string
  shortCode: string
  clicks: number
  createdAt: Date
}

export interface ShortenRequest {
  originalUrl: string
}

export interface ShortenResponse {
  shortCode: string
  shortUrl: string
}

export interface StatsResponse {
  originalUrl: string
  shortCode: string
  clicks: number
  createdAt: string
}
