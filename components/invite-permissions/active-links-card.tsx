import { useState } from "react"
import { Link2, Copy, Check, Ban } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/company-settings/settings-primitives"
import { ROLE_LABELS, ROLE_BADGE } from "./constants"
import type { CompanyInviteLink } from "@/services/onboarding.service"

type LinkStatus = "Active" | "Revoked" | "Expired" | "Exhausted"

const STATUS_BADGE: Record<LinkStatus, string> = {
  Active:    "bg-[#dcfce7] text-[#16a34a]",
  Revoked:   "bg-muted text-muted-foreground",
  Expired:   "bg-[#fef3c7] text-[#d97706]",
  Exhausted: "bg-[#fef3c7] text-[#d97706]",
}

function statusOf(link: CompanyInviteLink): LinkStatus {
  if (!link.isActive) return "Revoked"
  if (link.expiresAt && new Date() > new Date(link.expiresAt)) return "Expired"
  if (link.maxUses !== null && link.useCount >= link.maxUses) return "Exhausted"
  return "Active"
}

function CopyButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
      className="rounded-lg p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
      title="Copy link"
    >
      {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
    </button>
  )
}

export function ActiveLinksCard({
  links,
  loading,
  revokingId,
  onRevoke,
}: {
  links: CompanyInviteLink[]
  loading: boolean
  revokingId: number | null
  onRevoke: (id: number) => void
}) {
  return (
    <Card title="Invite Links" subtitle="All links generated for your company" icon={Link2}>
      {loading ? (
        <p className="text-xs text-muted-foreground">Loading invite links…</p>
      ) : links.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-border py-6 text-center">
          <Link2 className="mb-1.5 size-6 text-muted-foreground/40" />
          <p className="text-xs text-muted-foreground">No invite links generated yet</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Role</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Link</th>
                <th className="px-3 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Uses</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Expires</th>
                <th className="px-3 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-3 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {links.map(link => {
                const status = statusOf(link)
                const revocable = status === "Active"
                return (
                  <tr key={link.id} className="hover:bg-muted/50">
                    <td className="px-3 py-3">
                      <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", ROLE_BADGE[link.role])}>
                        {ROLE_LABELS[link.role]}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex max-w-56 items-center gap-1">
                        <span className="truncate text-foreground">{link.inviteUrl}</span>
                        <CopyButton url={link.inviteUrl} />
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center text-foreground">
                      {link.useCount}{link.maxUses !== null ? ` / ${link.maxUses}` : " / ∞"}
                    </td>
                    <td className="px-3 py-3 text-foreground">
                      {link.expiresAt ? new Date(link.expiresAt).toLocaleDateString() : "Never"}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", STATUS_BADGE[status])}>
                        {status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <button
                        onClick={() => onRevoke(link.id)}
                        disabled={!revocable || revokingId === link.id}
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-rose-500 transition hover:bg-rose-50 disabled:opacity-40 dark:hover:bg-rose-900/20"
                      >
                        <Ban className="size-3.5" />
                        {revokingId === link.id ? "Revoking…" : "Revoke"}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}
