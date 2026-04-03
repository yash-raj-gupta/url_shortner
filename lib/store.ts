import { ShortUrl } from "@/types"

// In-memory store using a Map
// Note: This will reset when the server restarts
// Will be replaced with Supabase in the future
const urlStore = new Map<string, ShortUrl>()

// Generate a random short code
function generateShortCode(length: number = 6): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Generate a unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

export function createShortUrl(originalUrl: string): ShortUrl {
  const shortCode = generateShortCode()
  const id = generateId()

  const shortUrl: ShortUrl = {
    id,
    originalUrl,
    shortCode,
    clicks: 0,
    createdAt: new Date(),
  }

  urlStore.set(shortCode, shortUrl)
  return shortUrl
}

export function getShortUrl(shortCode: string): ShortUrl | undefined {
  return urlStore.get(shortCode)
}

export function incrementClicks(shortCode: string): ShortUrl | undefined {
  const url = urlStore.get(shortCode)
  if (url) {
    url.clicks += 1
    urlStore.set(shortCode, url)
  }
  return url
}

export function getAllUrls(): ShortUrl[] {
  return Array.from(urlStore.values())
}
