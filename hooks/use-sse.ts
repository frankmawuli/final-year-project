"use client"

import { useCallback, useEffect, useRef } from "react"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"

export interface SseNotification {
  id: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
}

interface UseSseOptions {
  /** Called when a new notification arrives */
  onNotification?: (notification: SseNotification) => void
  /** Called when the connection opens */
  onConnect?: () => void
  /** Whether to open the connection */
  enabled?: boolean
}

/**
 * Opens an SSE connection to /sse and calls `onNotification` for each event.
 * Automatically reconnects on disconnect with exponential back-off.
 */
export function useSSE({ onNotification, onConnect, enabled = true }: UseSseOptions = {}) {
  const esRef = useRef<EventSource | null>(null)
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reconnectDelay = useRef(1000)
  const unmounted = useRef(false)

  const connect = useCallback(() => {
    if (unmounted.current || !enabled) return

    const es = new EventSource(`${BASE_URL}/sse`)
    esRef.current = es

    es.onopen = () => {
      reconnectDelay.current = 1000
      onConnect?.()
    }

    es.addEventListener("notification", (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data) as SseNotification
        onNotification?.(data)
      } catch {
        // ignore malformed events
      }
    })

    es.onerror = () => {
      es.close()
      esRef.current = null
      if (unmounted.current) return
      const delay = Math.min(reconnectDelay.current, 30_000)
      reconnectDelay.current = delay * 2
      reconnectTimer.current = setTimeout(connect, delay)
    }
  }, [enabled, onConnect, onNotification])

  useEffect(() => {
    unmounted.current = false
    connect()

    return () => {
      unmounted.current = true
      esRef.current?.close()
      esRef.current = null
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled])

  const disconnect = useCallback(() => {
    esRef.current?.close()
    esRef.current = null
    if (reconnectTimer.current) clearTimeout(reconnectTimer.current)
  }, [])

  return { disconnect }
}
