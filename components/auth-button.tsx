"use client"

import { useAuth } from "@/lib/auth-context"
import { LogOut, History, Loader2 } from "lucide-react"
import Link from "next/link"

export function AuthButton() {
  const { user, loading, signInWithGoogle, signOut } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
      </div>
    )
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <Link
          href="/history"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <History className="w-4 h-4" />
          History
        </Link>
        <div className="flex items-center gap-3">
          {user.user_metadata?.avatar_url && (
            <img
              src={user.user_metadata.avatar_url}
              alt={user.user_metadata?.name || "User"}
              className="w-8 h-8 rounded-full"
            />
          )}
          {!user.user_metadata?.avatar_url && (
            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-sm font-medium text-zinc-600 dark:text-zinc-300">
              {user.email?.charAt(0).toUpperCase()}
            </div>
          )}
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => signInWithGoogle()}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
    >
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
      Sign in with Google
    </button>
  )
}
