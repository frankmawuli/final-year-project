import { useState } from "react"
import { Link as LinkIcon, ChevronDown, Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/company-settings/settings-primitives"
import { inputCls, selectCls } from "@/components/company-settings/constants"
import { ROLE_OPTIONS, ROLE_LABELS } from "./constants"
import type { InviteLinkRole } from "@/services/onboarding.service"

export function GenerateLinkCard({
  onGenerate,
  generating,
  lastGeneratedUrl,
}: {
  onGenerate: (opts: { role: InviteLinkRole; maxUses?: number; expiresInDays?: number }) => void
  generating: boolean
  lastGeneratedUrl: string | null
}) {
  const [role, setRole] = useState<InviteLinkRole>("EMPLOYEE")
  const [maxUses, setMaxUses] = useState("")
  const [expiresInDays, setExpiresInDays] = useState("7")
  const [copied, setCopied] = useState(false)

  function handleGenerate() {
    onGenerate({
      role,
      maxUses: maxUses ? Number(maxUses) : undefined,
      expiresInDays: expiresInDays ? Number(expiresInDays) : undefined,
    })
  }

  function copyLink() {
    if (!lastGeneratedUrl) return
    navigator.clipboard.writeText(lastGeneratedUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card title="Generate Invite Link" subtitle="Create a shareable link that lets people join your workspace" icon={LinkIcon}>
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">Role</label>
            <div className="relative">
              <select value={role} onChange={e => setRole(e.target.value as InviteLinkRole)} className={selectCls}>
                {ROLE_OPTIONS.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">Max Uses</label>
            <input
              type="number"
              min="1"
              value={maxUses}
              onChange={e => setMaxUses(e.target.value)}
              placeholder="Unlimited"
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">Expires In (days)</label>
            <input
              type="number"
              min="1"
              max="365"
              value={expiresInDays}
              onChange={e => setExpiresInDays(e.target.value)}
              placeholder="Never"
              className={inputCls}
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex w-fit items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-60"
        >
          <LinkIcon className="size-3.5" />
          {generating ? "Generating…" : "Generate link"}
        </button>

        {lastGeneratedUrl && (
          <div className="flex items-center gap-1.5 rounded-xl border border-dashed border-primary bg-primary/5 px-3 py-2.5">
            <LinkIcon className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="flex-1 truncate text-xs text-foreground">{lastGeneratedUrl}</span>
            <button
              onClick={copyLink}
              className={cn(
                "flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold",
                copied ? "bg-emerald-500 text-white" : "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        )}
      </div>
    </Card>
  )
}
