'use client'

import { useCallback, useEffect, useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'

/**
 * router.refresh() re-renders the page on the server in the background, so a
 * list only shows a new or changed row a moment later. refresh() here returns
 * a promise that resolves once the page shows the new data: await it before
 * closing a dialog, and keep the save button busy while isRefreshing.
 */
export default function useRefresh() {
  const router = useRouter()
  const [isRefreshing, startTransition] = useTransition()
  const waiting = useRef([])

  const release = useCallback(() => {
    waiting.current.forEach((resolve) => resolve())
    waiting.current = []
  }, [])

  // The transition ends once the refreshed page has rendered
  useEffect(() => {
    if (!isRefreshing) release()
  }, [isRefreshing, release])

  // A deleted row's dialog unmounts with the row; don't leave callers waiting
  useEffect(() => release, [release])

  const refresh = useCallback(
    () =>
      new Promise((resolve) => {
        waiting.current.push(resolve)
        startTransition(() => router.refresh())
      }),
    [router]
  )

  return { refresh, isRefreshing }
}
