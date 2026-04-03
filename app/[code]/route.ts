import { NextRequest, NextResponse } from "next/server"
import { getShortUrl, incrementClicks } from "@/lib/store"

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

    // Increment click count
    await incrementClicks(code)

    // Redirect to the original URL
    return NextResponse.redirect(shortUrl.originalUrl)
  } catch (error) {
    console.error("Error redirecting:", error)
    return NextResponse.json(
      { error: "Failed to redirect" },
      { status: 500 }
    )
  }
}
