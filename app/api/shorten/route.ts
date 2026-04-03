import { NextRequest, NextResponse } from "next/server"
import { createShortUrl, getShortUrl } from "@/lib/store"
import { isValidUrl } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { originalUrl } = body

    if (!originalUrl) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      )
    }

    if (!isValidUrl(originalUrl)) {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      )
    }

    const shortUrl = createShortUrl(originalUrl)

    const baseUrl = request.nextUrl.origin
    const shortUrlStr = `${baseUrl}/${shortUrl.shortCode}`

    return NextResponse.json({
      shortCode: shortUrl.shortCode,
      shortUrl: shortUrlStr,
    })
  } catch (error) {
    console.error("Error creating short URL:", error)
    return NextResponse.json(
      { error: "Failed to create short URL" },
      { status: 500 }
    )
  }
}
