import { NextRequest, NextResponse } from "next/server"
import { getShortUrl } from "@/lib/store"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params

    if (!code) {
      return NextResponse.json(
        { error: "Short code is required" },
        { status: 400 }
      )
    }

    const shortUrl = await getShortUrl(code)

    if (!shortUrl) {
      return NextResponse.json(
        { error: "Short URL not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      originalUrl: shortUrl.originalUrl,
      shortCode: shortUrl.shortCode,
      clicks: shortUrl.clicks,
      createdAt: shortUrl.createdAt?.toISOString() || new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    )
  }
}
