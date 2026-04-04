"use client"

import { useState } from "react"
import { Link2, Copy, Check, ExternalLink, BarChart3 } from "lucide-react"
import { AuthButton } from "@/components/auth-button"
import { useAuth } from "@/lib/auth-context"

interface ShortenResult {
  shortCode: string
  shortUrl: string
}

export default function Home() {
  const { user } = useAuth()
  const [originalUrl, setOriginalUrl] = useState("")
  const [result, setResult] = useState<ShortenResult | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setResult(null)
    setLoading(true)

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalUrl,
          userId: user?.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to shorten URL")
        return
      }

      setResult(data)
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (result?.shortUrl) {
      navigator.clipboard.writeText(result.shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-black dark:to-zinc-900">
      <header className="absolute top-0 left-0 right-0 p-6">
        <div className="max-w-2xl mx-auto flex justify-end">
          <AuthButton />
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-900 dark:bg-white rounded-2xl mb-6">
            <Link2 className="w-8 h-8 text-white dark:text-zinc-900" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
            URL Shortener
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Shorten your long URLs and track clicks
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 border border-zinc-200 dark:border-zinc-800"
        >
          <label
            htmlFor="url-input"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
          >
            Enter your long URL
          </label>
          <div className="flex gap-3">
            <input
              id="url-input"
              type="url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="https://example.com/very/long/url"
              required
              className="flex-1 px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "Shortening..." : "Shorten"}
            </button>
          </div>

          {error && (
            <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          {user && (
            <p className="mt-3 text-xs text-green-600 dark:text-green-400">
              Logged in as {user.email} - Your URLs will be saved to your history
            </p>
          )}
        </form>

        {result && (
          <div className="mt-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-zinc-200 dark:border-zinc-800 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3">
              Your shortened URL
            </p>
            <div className="flex items-center gap-3">
              <input
                type="text"
                readOnly
                value={result.shortUrl}
                className="flex-1 px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-sm"
              />
              <button
                onClick={copyToClipboard}
                className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
              <a
                href={result.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                title="Open in new tab"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
              <a
                href={`/stats/${result.shortCode}`}
                className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                title="View stats"
              >
                <BarChart3 className="w-5 h-5" />
              </a>
            </div>
            <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
              Click the chart icon to view click statistics
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
