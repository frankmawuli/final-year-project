"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { useAuth } from "@/context/auth-context"
import { onboardingService } from "@/services/onboarding.service"
import type { BulkInviteResult, CompanyInviteLink, InviteLinkRole } from "@/services/onboarding.service"
import { ApiError } from "@/lib/api-client"
import { GenerateLinkCard } from "@/components/invite-permissions/generate-link-card"
import { ActiveLinksCard } from "@/components/invite-permissions/active-links-card"
import { BulkUploadCard } from "@/components/invite-permissions/bulk-upload-card"

export default function InvitePermissionsPage() {
  const { accessToken } = useAuth()
  const [links, setLinks] = useState<CompanyInviteLink[]>([])
  const [linksLoading, setLinksLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [lastGeneratedUrl, setLastGeneratedUrl] = useState<string | null>(null)
  const [revokingId, setRevokingId] = useState<number | null>(null)
  const [uploading, setUploading] = useState(false)
  const [bulkResult, setBulkResult] = useState<BulkInviteResult | null>(null)

  const loadLinks = useCallback(() => {
    if (!accessToken) return
    setLinksLoading(true)
    onboardingService
      .listInviteLinks(accessToken)
      .then(res => setLinks(res.data))
      .catch(() => toast.error("Failed to load invite links"))
      .finally(() => setLinksLoading(false))
  }, [accessToken])

  useEffect(() => {
    loadLinks()
  }, [loadLinks])

  async function handleGenerate(opts: { role: InviteLinkRole; maxUses?: number; expiresInDays?: number }) {
    if (!accessToken) return
    setGenerating(true)
    try {
      const res = await onboardingService.generateInviteLink(accessToken, opts)
      setLastGeneratedUrl(res.data.inviteUrl)
      toast.success("Invite link generated")
      loadLinks()
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to generate invite link")
    } finally {
      setGenerating(false)
    }
  }

  async function handleRevoke(id: number) {
    if (!accessToken) return
    setRevokingId(id)
    try {
      await onboardingService.revokeInviteLink(accessToken, id)
      toast.success("Invite link revoked")
      setLinks(prev => prev.map(l => l.id === id ? { ...l, isActive: false } : l))
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to revoke invite link")
    } finally {
      setRevokingId(null)
    }
  }

  async function handleBulkUpload(file: File) {
    if (!accessToken) return
    setUploading(true)
    setBulkResult(null)
    try {
      const res = await onboardingService.bulkInvite(accessToken, file)
      setBulkResult(res.data)
      if (res.data.failedCount === 0) {
        toast.success(`Invited ${res.data.invitedCount} employee(s)`)
      } else {
        toast.warning(`Invited ${res.data.invitedCount} of ${res.data.total} — ${res.data.failedCount} failed`)
      }
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Bulk upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <GenerateLinkCard
        onGenerate={handleGenerate}
        generating={generating}
        lastGeneratedUrl={lastGeneratedUrl}
      />

      <ActiveLinksCard
        links={links}
        loading={linksLoading}
        revokingId={revokingId}
        onRevoke={handleRevoke}
      />

      <BulkUploadCard
        onUpload={handleBulkUpload}
        uploading={uploading}
        result={bulkResult}
      />
    </div>
  )
}
