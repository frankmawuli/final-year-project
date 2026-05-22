"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

// ── Brand logos (inline SVG) ──────────────────────────────────
function SlackLogo() {
  return (
    <svg viewBox="0 0 54 54" className="size-8" fill="none">
      <path d="M19.7 33.5a4.85 4.85 0 0 1-4.85 4.85 4.85 4.85 0 0 1-4.85-4.85 4.85 4.85 0 0 1 4.85-4.85H19.7v4.85Z" fill="#E01E5A"/>
      <path d="M22.2 33.5a4.85 4.85 0 0 1 4.85-4.85 4.85 4.85 0 0 1 4.85 4.85v12.15a4.85 4.85 0 0 1-4.85 4.85 4.85 4.85 0 0 1-4.85-4.85V33.5Z" fill="#E01E5A"/>
      <path d="M27.05 19.7a4.85 4.85 0 0 1-4.85-4.85 4.85 4.85 0 0 1 4.85-4.85 4.85 4.85 0 0 1 4.85 4.85V19.7h-4.85Z" fill="#36C5F0"/>
      <path d="M27.05 22.2a4.85 4.85 0 0 1 4.85 4.85 4.85 4.85 0 0 1-4.85 4.85H14.9a4.85 4.85 0 0 1-4.85-4.85 4.85 4.85 0 0 1 4.85-4.85h12.15Z" fill="#36C5F0"/>
      <path d="M40.85 27.05a4.85 4.85 0 0 1 4.85 4.85 4.85 4.85 0 0 1-4.85 4.85 4.85 4.85 0 0 1-4.85-4.85V27.05h4.85Z" fill="#2EB67D"/>
      <path d="M38.35 27.05a4.85 4.85 0 0 1-4.85-4.85 4.85 4.85 0 0 1 4.85-4.85H50.5a4.85 4.85 0 0 1 4.85 4.85 4.85 4.85 0 0 1-4.85 4.85H38.35Z" fill="#2EB67D"/>
      <path d="M33.5 13.9a4.85 4.85 0 0 1-4.85-4.85A4.85 4.85 0 0 1 33.5 4.2a4.85 4.85 0 0 1 4.85 4.85V13.9H33.5Z" fill="#ECB22E"/>
      <path d="M33.5 16.4a4.85 4.85 0 0 1 4.85 4.85 4.85 4.85 0 0 1-4.85 4.85H21.35a4.85 4.85 0 0 1-4.85-4.85 4.85 4.85 0 0 1 4.85-4.85H33.5Z" fill="#ECB22E"/>
    </svg>
  )
}

function HubspotLogo() {
  return (
    <svg viewBox="0 0 32 32" className="size-8" fill="none">
      <circle cx="16" cy="16" r="16" fill="#FF7A59"/>
      <circle cx="16" cy="11" r="3.5" fill="white"/>
      <circle cx="22" cy="18" r="3.5" fill="white"/>
      <circle cx="10" cy="18" r="3.5" fill="white"/>
      <circle cx="16" cy="24" r="3.5" fill="white"/>
    </svg>
  )
}

function DiscordLogo() {
  return (
    <svg viewBox="0 0 32 32" className="size-8" fill="none">
      <circle cx="16" cy="16" r="16" fill="#5865F2"/>
      <path d="M21.5 10.5c-1.2-.55-2.5-.95-3.85-1.18a.07.07 0 0 0-.07.03c-.17.3-.35.68-.48.98a17.4 17.4 0 0 0-5.2 0 9.8 9.8 0 0 0-.49-.98.07.07 0 0 0-.07-.03c-1.36.23-2.65.63-3.85 1.18a.06.06 0 0 0-.03.03C5.27 14.3 4.6 18 4.93 21.65a.07.07 0 0 0 .03.05 18.3 18.3 0 0 0 5.5 2.77.07.07 0 0 0 .08-.03c.42-.58.8-1.18 1.12-1.82a.07.07 0 0 0-.04-.1 12 12 0 0 1-1.73-.82.07.07 0 0 1-.01-.12c.12-.09.23-.18.34-.27a.07.07 0 0 1 .07-.01c3.63 1.65 7.56 1.65 11.15 0a.07.07 0 0 1 .07.01c.11.09.23.18.35.27a.07.07 0 0 1-.01.12 11.4 11.4 0 0 1-1.73.82.07.07 0 0 0-.04.1c.33.64.7 1.24 1.12 1.82a.07.07 0 0 0 .08.03 18.2 18.2 0 0 0 5.51-2.77.07.07 0 0 0 .03-.05c.39-4.03-.65-7.7-2.75-10.87a.06.06 0 0 0-.03-.03ZM12.52 19.5c-1.12 0-2.04-1.03-2.04-2.3s.9-2.3 2.04-2.3c1.15 0 2.06 1.04 2.04 2.3 0 1.27-.9 2.3-2.04 2.3Zm7.53 0c-1.12 0-2.04-1.03-2.04-2.3s.9-2.3 2.04-2.3c1.15 0 2.06 1.04 2.04 2.3 0 1.27-.89 2.3-2.04 2.3Z" fill="white"/>
    </svg>
  )
}

function SalesforceLogo() {
  return (
    <svg viewBox="0 0 32 32" className="size-8" fill="none">
      <ellipse cx="16" cy="16" rx="14" ry="11" fill="#00A1E0"/>
      <path d="M10 14.5c.8-1.5 2.3-2.5 4-2.5 1.3 0 2.5.5 3.3 1.4.6-.5 1.4-.9 2.2-.9 1.9 0 3.5 1.6 3.5 3.5s-1.6 3.5-3.5 3.5H10.5c-1.7 0-3-1.3-3-3s1.3-3 3-3c-.2.3-.3.6-.3 1H10c-.8 0-1.5.7-1.5 1.5S9.2 17 10 17h9.5c1.1 0 2-.9 2-2s-.9-2-2-2c-.6 0-1.1.3-1.5.7-.6-1-1.7-1.7-3-1.7-1.5 0-2.8.9-3.3 2.2L10 14.5Z" fill="white"/>
    </svg>
  )
}

function FigmaLogo() {
  return (
    <svg viewBox="0 0 32 32" className="size-8" fill="none">
      <rect x="8" y="4" width="8" height="8" rx="4" fill="#F24E1E"/>
      <rect x="16" y="4" width="8" height="8" rx="4" fill="#FF7262"/>
      <rect x="8" y="12" width="8" height="8" rx="4" fill="#A259FF"/>
      <rect x="8" y="20" width="8" height="8" rx="4" fill="#0ACF83"/>
      <circle cx="20" cy="16" r="4" fill="#1ABCFE"/>
    </svg>
  )
}

function JiraLogo() {
  return (
    <svg viewBox="0 0 32 32" className="size-8" fill="none">
      <rect x="4" y="4" width="24" height="24" rx="4" fill="#0052CC"/>
      <path d="M16 8 8 16l4 4 4-4 4 4 4-4-8-8Z" fill="white" opacity="0.6"/>
      <path d="M16 24l8-8-4-4-4 4-4-4-4 4 8 8Z" fill="white"/>
    </svg>
  )
}

function TelegramLogo() {
  return (
    <svg viewBox="0 0 32 32" className="size-8" fill="none">
      <circle cx="16" cy="16" r="16" fill="#229ED9"/>
      <path d="M6.5 15.8 25 8.4c.8-.3 1.5.2 1.2 1.3l-3.1 14.6c-.2 1-.9 1.2-1.8.7l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5.2 9.8-8.8c.4-.4 0-.6-.7-.2l-12 7.6-5.2-1.6c-1.1-.4-1.2-1.1.3-1.6Z" fill="white"/>
    </svg>
  )
}

function AsanaLogo() {
  return (
    <svg viewBox="0 0 32 32" className="size-8" fill="none">
      <circle cx="16" cy="12" r="5" fill="#F06A6A"/>
      <circle cx="9" cy="21" r="5" fill="#F06A6A"/>
      <circle cx="23" cy="21" r="5" fill="#F06A6A"/>
    </svg>
  )
}

function ZoomLogo() {
  return (
    <svg viewBox="0 0 32 32" className="size-8" fill="none">
      <rect width="32" height="32" rx="8" fill="#2D8CFF"/>
      <path d="M6 11h13a2 2 0 0 1 2 2v8H8a2 2 0 0 1-2-2v-8Z" fill="white"/>
      <path d="M21 14.5 27 11v10l-6-3.5V14.5Z" fill="white"/>
    </svg>
  )
}

function NotionLogo() {
  return (
    <svg viewBox="0 0 32 32" className="size-8" fill="none">
      <rect width="32" height="32" rx="6" fill="white" stroke="#E5E5E5"/>
      <path d="M9 8h9.5l5.5 5.5V24H9V8Z" fill="white"/>
      <path d="M18.5 8v5.5H24M12 13h8M12 16.5h8M12 20h5" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

// ── Data ──────────────────────────────────────────────────────
const INTEGRATIONS = [
  {
    id: "google",
    name: "Slack",
    description: "Messaging app for business that connects people to the information they need.",
    Logo: SlackLogo,
    connected: true,
  },

  
  
  
  
  
  
  
]

// ── Page ──────────────────────────────────────────────────────
export default function IntegrationsPage() {
  const [connected, setConnected] = useState<Record<string, boolean>>(
    Object.fromEntries(INTEGRATIONS.map(i => [i.id, i.connected]))
  )

  function toggle(id: string) {
    setConnected(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-foreground">Integrations</h2>
        <p className="text-sm text-muted-foreground">Connect your favourite tools and services to streamline your workflow.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {INTEGRATIONS.map(({ id, name, description, Logo }, i) => (
          <div key={id}>
            <div className="flex items-center gap-4 px-6 py-4">
              <div className="shrink-0">
                <Logo />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{name}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
              </div>
              <div className="shrink-0">
                <button
                  onClick={() => toggle(id)}
                  className={cn(
                    "rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
                    connected[id]
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border border-border bg-background text-foreground hover:bg-muted"
                  )}
                >
                  {connected[id] ? "Connected" : "Connect"}
                </button>
              </div>
            </div>
            {i < INTEGRATIONS.length - 1 && <hr className="border-border mx-6" />}
          </div>
        ))}
      </div>
    </div>
  )
}
