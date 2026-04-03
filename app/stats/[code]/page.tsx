"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, Link2, MousePointerClick, Calendar, ExternalLink } from "lucide-react"

interface StatsData {
  originalUrl: string
  shortCode: string
  clicks: number
  createdAt: string
}

export default function StatsPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const resolvedParams = await params
        const response = await fetch(`/api/stats/${resolvedParams.code}`)
        const data = await response.json()

        if (!response.ok) {
          setError(data.error || "Failed to fetch stats")
          return
        }

        setStats(data)
      } catch (err) {
        setError("Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [params])

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <div className="text-zinc-600 dark:text-zinc-400">Loading stats...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <a
            href="/"
            className="inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back home
          </a>
        </div>
      </div>
    )
  }

  const createdDate = stats ? new Date(stats.createdAt).toLocaleDateString() : ""

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-black dark:to-zinc-900">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Shorten another URL
        </a>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 border border-zinc-200 dark:border-zinc-800">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
            URL Statistics
          </h1>

          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                Original URL
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1 px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm truncate">
                  {stats?.originalUrl}
                </div>
                <a
                  href={stats?.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-xl bg-zinc-100 dark:bg-zinc-800">
                <div className="flex items-center gap-3 mb-2">
                  <MousePointerClick className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Total Clicks
                  </p>
                </div>
                <p className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
                  {stats?.clicks}
                </p>
              </div>

              <div className="p-6 rounded-xl bg-zinc-100 dark:bg-zinc-800">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Created
                  </p>
                </div>
                <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {createdDate}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                Short URL
              </p>
              <a
                href={`/${stats?.shortCode}`}
                className="inline-flex items-center gap-2 text-zinc-900 dark:text-zinc-50 hover:underline font-mono"
              >
                <Link2 className="w-4 h-4" />
                {typeof window !== "undefined" ? window.location.origin : ""}/{stats?.shortCode}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
