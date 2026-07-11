"use client"

import Script from "next/script"
import { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string
            callback: (response: { credential: string }) => void
          }) => void
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void
        }
      }
    }
  }
}

function GoogleIcon() {
  return (
    <svg className="mr-1.5 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

interface GoogleAuthButtonProps {
  /** Called with the Google ID token once the user picks an account. */
  onCredential: (idToken: string) => void
  disabled?: boolean
  label?: string
}

/**
 * Renders our own pill button but overlays Google's real Sign In With Google
 * iframe on top (opacity 0, stretched to fill). The user's click lands
 * directly on Google's iframe — required because a synthetic click on
 * Google's button can't be forwarded into it (cross-origin iframe).
 */
export function GoogleAuthButton({ onCredential, disabled, label = "Continue with Google" }: GoogleAuthButtonProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  const setup = useCallback(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    if (!clientId || !window.google || !overlayRef.current) return
    overlayRef.current.innerHTML = ""
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => onCredential(response.credential),
    })
    window.google.accounts.id.renderButton(overlayRef.current, {
      type: "standard",
      size: "large",
      width: 336,
    })
    setReady(true)
  }, [onCredential])

  useEffect(() => {
    if (window.google) setup()
  }, [setup])

  return (
    <div className="relative h-11 w-full">
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onReady={setup} />
      <Button
        variant="outline"
        size="lg"
        type="button"
        disabled={disabled || !ready}
        className="h-11 w-full rounded-xl border-border text-xs font-medium"
      >
        <GoogleIcon />
        {label}
      </Button>
      <div
        ref={overlayRef}
        aria-hidden
        className="absolute inset-0 overflow-hidden opacity-0 [&_iframe]:!h-full [&_iframe]:!w-full"
      />
    </div>
  )
}
