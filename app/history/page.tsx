"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { getUrlsByUser, deleteUrl } from "@/lib/store"
import { Link2, Copy, Check, ExternalLink, Trash2, BarChart3, ArrowLeft, Loader2 } from "lucide-react"
import { ShortUrl } from "@/types"
import Link from "next/link"

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [urls, setUrls] = useState<ShortUrl[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      loadUrls()
    }
  }, [user])

  const loadUrls = async () => {
    if (!user) return
    try {
      const data = await getUrlsByUser(user.id)
      setUrls(data)
    } catch (error) {
      console.error("Error loading URLs:", error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (shortCode: string) => {
    const shortUrl = `${window.location.origin}/${shortCode}`
    navigator.clipboard.writeText(shortUrl)
    setCopiedId(shortCode)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDelete = async (id: string) => {
    if (!user || !confirm("Are you sure you want to delete this URL?")) return

    setDeleting(id)
    try {
      await deleteUrl(id, user.id)
      setUrls(urls.filter((url) => url.id !== id))
    } catch (error) {
      console.error("Error deleting URL:", error)
    } finally {
      setDeleting(null)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-black dark:to-zinc-900">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-zinc-900 dark:bg-white rounded-xl flex items-center justify-center">
              <Link2 className="w-6 h-6 text-white dark:text-zinc-900" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                Your URLs
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400">
                {urls.length} URL{urls.length !== 1 ? "s" : ""} shortened
              </p>
            </div>
          </div>

          {urls.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-500 dark:text-zinc-400 mb-4">
                You haven&apos;t shortened any URLs yet
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                Shorten your first URL
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {urls.map((url) => (
                <div
                  key={url.id}
                  className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                        {url.originalUrl}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <a
                          href={`/${url.shortCode}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                        >
                          {typeof window !== "undefined"
                            ? window.location.origin
                            : ""}
                          /{url.shortCode}
                        </a>
                        <span className="text-xs text-zinc-400">
                          {url.clicks} click{url.clicks !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1">
                        Created{" "}
                        {url.createdAt
                          ? new Date(url.createdAt).toLocaleDateString()
                          : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(url.shortCode)}
                        className="p-2 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                        title="Copy short URL"
                      >
                        {copiedId === url.shortCode ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <a
                        href={`/stats/${url.shortCode}`}
                        className="p-2 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                        title="View stats"
                      >
                        <BarChart3 className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleDelete(url.id)}
                        disabled={deleting === url.id}
                        className="p-2 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 transition-colors disabled:opacity-50"
                        title="Delete URL"
                      >
                        {deleting === url.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
