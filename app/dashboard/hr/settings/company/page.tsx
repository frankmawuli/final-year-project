"use client"

import { useState, useRef, useEffect } from "react"
import { toast } from "sonner"
import { useAuth } from "@/context/auth-context"
import { uploadService } from "@/services/upload.service"
import { onboardingService } from "@/services/onboarding.service"
import { SaveRow } from "@/components/company-settings/settings-primitives"
import { CompanyProfileCard } from "@/components/company-settings/company-profile-card"
import { WorkingHoursCard } from "@/components/company-settings/working-hours-card"
import { OfficeLocationsCard } from "@/components/company-settings/office-locations-card"
import type { CompanyProfileData, OfficeLocation } from "@/components/company-settings/types"

export default function CompanySettings() {
  const { accessToken } = useAuth()
  const [logoPreview,     setLogoPreview]     = useState<string | null>(null)
  const [logoUrl,         setLogoUrl]         = useState<string | null>(null)
  const [logoUploading,   setLogoUploading]   = useState(false)
  const [logoUploadError, setLogoUploadError] = useState<string | null>(null)
  const [profile, setProfile] = useState<CompanyProfileData>({
    companyName: "",
    website:     "",
    industry:    "Technology",
    companySize: "11–50",
    timezone:    "UTC+0 — London",
    currency:    "GHS — Ghanaian Cedi",
    fiscalYear:  "January",
    dateFormat:  "DD/MM/YYYY",
  })
  const [workStart,   setWorkStart]   = useState("09:00")
  const [workEnd,     setWorkEnd]     = useState("17:00")
  const [workDays,    setWorkDays]    = useState(["Mon", "Tue", "Wed", "Thu", "Fri"])
  const [locations,   setLocations]   = useState<OfficeLocation[]>([])
  const [newLocName,  setNewLocName]  = useState("")
  const [newLocType,  setNewLocType]  = useState("Office")
  const [loading,     setLoading]     = useState(true)
  const [saving,      setSaving]      = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!accessToken) return
    let cancelled = false
    onboardingService
      .getCompany(accessToken)
      .then((res) => {
        if (cancelled) return
        const company = res.data
        setProfile(prev => ({
          ...prev,
          companyName: company.name ?? "",
          website: company.website ?? "",
          industry: company.industry ?? prev.industry,
          companySize: company.size ?? prev.companySize,
          timezone: company.timezone ?? prev.timezone,
        }))
        if (company.logoUrl) {
          setLogoUrl(company.logoUrl)
          setLogoPreview(company.logoUrl)
        }
      })
      .catch(() => {
        if (!cancelled) toast.error("Failed to load company settings")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [accessToken])

  function updateProfile<K extends keyof CompanyProfileData>(field: K, value: CompanyProfileData[K]) {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoPreview(URL.createObjectURL(file))
    setLogoUploadError(null)
    setLogoUploading(true)
    try {
      const result = await uploadService.image(file, accessToken ?? "")
      setLogoUrl(result.url)
      setLogoPreview(result.url)
    } catch {
      setLogoUploadError("Logo upload failed. Please try again.")
    } finally {
      setLogoUploading(false)
    }
  }

  function handleLogoRemove() {
    setLogoPreview(null)
    setLogoUrl(null)
  }

  function toggleDay(d: string) {
    setWorkDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])
  }

  function addLocation() {
    if (!newLocName.trim()) return
    setLocations(prev => [...prev, { id: crypto.randomUUID(), name: newLocName.trim(), type: newLocType }])
    setNewLocName("")
  }

  function removeLocation(id: string) {
    setLocations(prev => prev.filter(l => l.id !== id))
  }

  async function onSave() {
    if (!accessToken) return
    setSaving(true)
    try {
      await onboardingService.updateCompany(accessToken, {
        name: profile.companyName || undefined,
        website: profile.website || undefined,
        industry: profile.industry,
        size: profile.companySize,
        timezone: profile.timezone,
        logoUrl: logoUrl || undefined,
      })
      toast.success("Company settings saved")
    } catch {
      toast.error("Failed to save company settings")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="text-xs text-muted-foreground">Loading company settings…</p>
  }

  return (
    <div className="flex flex-col gap-5">
      <CompanyProfileCard
        data={profile}
        onChange={updateProfile}
        logoPreview={logoPreview}
        logoUploading={logoUploading}
        logoUploadError={logoUploadError}
        onLogoChange={handleLogoChange}
        onLogoRemove={handleLogoRemove}
        fileRef={fileRef}
      />

      <WorkingHoursCard
        workStart={workStart}
        workEnd={workEnd}
        onWorkStartChange={setWorkStart}
        onWorkEndChange={setWorkEnd}
        workDays={workDays}
        onToggleDay={toggleDay}
      />

      <OfficeLocationsCard
        locations={locations}
        newLocName={newLocName}
        newLocType={newLocType}
        onNewLocNameChange={setNewLocName}
        onNewLocTypeChange={setNewLocType}
        onAddLocation={addLocation}
        onRemoveLocation={removeLocation}
      />

      <SaveRow onSave={onSave} saving={saving} />
    </div>
  )
}
