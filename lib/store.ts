import { ShortUrl } from "@/types"
import { supabase } from "./supabase"

// Generate a random short code
function generateShortCode(length: number = 6): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export async function createShortUrl(originalUrl: string): Promise<ShortUrl> {
  const shortCode = generateShortCode()

  const { data, error } = await supabase
    .from("shortened_urls")
    .insert({
      original_url: originalUrl,
      short_code: shortCode,
      clicks: 0,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating short URL:", error)
    throw new Error("Failed to create short URL")
  }

  return {
    id: data.id,
    originalUrl: data.original_url,
    shortCode: data.short_code,
    clicks: data.clicks,
    createdAt: new Date(data.created_at),
  }
}

export async function getShortUrl(shortCode: string): Promise<ShortUrl | null> {
  const { data, error } = await supabase
    .from("shortened_urls")
    .select("*")
    .eq("short_code", shortCode)
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      // PGRST116 = no rows returned
      return null
    }
    console.error("Error fetching short URL:", error)
    throw new Error("Failed to fetch short URL")
  }

  return {
    id: data.id,
    originalUrl: data.original_url,
    shortCode: data.short_code,
    clicks: data.clicks,
    createdAt: new Date(data.created_at),
  }
}

export async function incrementClicks(shortCode: string): Promise<ShortUrl | null> {
  // First get the current URL
  const url = await getShortUrl(shortCode)
  if (!url) return null

  // Increment the click count
  const { data, error } = await supabase
    .from("shortened_urls")
    .update({ clicks: url.clicks + 1 })
    .eq("short_code", shortCode)
    .select()
    .single()

  if (error) {
    console.error("Error incrementing clicks:", error)
    throw new Error("Failed to increment clicks")
  }

  return {
    id: data.id,
    originalUrl: data.original_url,
    shortCode: data.short_code,
    clicks: data.clicks,
    createdAt: new Date(data.created_at),
  }
}

export async function getAllUrls(): Promise<ShortUrl[]> {
  const { data, error } = await supabase
    .from("shortened_urls")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching all URLs:", error)
    throw new Error("Failed to fetch URLs")
  }

  return data.map((url) => ({
    id: url.id,
    originalUrl: url.original_url,
    shortCode: url.short_code,
    clicks: url.clicks,
    createdAt: new Date(url.created_at),
  }))
}
