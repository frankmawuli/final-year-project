"use client"

import { useState } from "react"
import {
  Bell,
  Check,
  ChevronDown,
  Globe2,
  KeyRound,
  Mail,
  Megaphone,
  Save,
  ServerCog,
  Settings2,
  ShieldCheck,
  ToggleLeft,
  UserPlus,
  X,
} from "lucide-react"
import AdminSidebar from "@/components/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type Tab = "general" | "communications" | "security" | "access" | "system"

type ToggleProps = {
  label: string
  description: string
  value: boolean
  onChange: () => void
}

function SettingToggle({ label, description, value, onChange }: ToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-xs font-semibold">{label}</p>
        <p className="mt-1 max-w-lg text-[11px] leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      <button
        type="button"
        onClick={onChange}
        aria-pressed={value}
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${value ? "bg-primary" : "bg-muted"}`}
      >
        <span
          className={`absolute top-0.5 size-4 rounded-full bg-white transition-transform ${value ? "left-4" : "left-0.5"}`}
        />
      </button>
    </div>
  )
}

const tabs: { id: Tab; label: string; icon: typeof Globe2 }[] = [
  { id: "general", label: "General", icon: Globe2 },
  { id: "communications", label: "Email & notifications", icon: Mail },
  { id: "security", label: "Password policy", icon: KeyRound },
  { id: "access", label: "Roles & invitations", icon: UserPlus },
  { id: "system", label: "System operations", icon: ServerCog },
]

export default function AdminSettingsPage() {
  const [tab, setTab] = useState<Tab>("general")
  const [notice, setNotice] = useState("")
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [newUserEmails, setNewUserEmails] = useState(true)
  const [securityEmails, setSecurityEmails] = useState(true)
  const [weeklyReports, setWeeklyReports] = useState(false)
  const [featureFlags, setFeatureFlags] = useState({
    advancedReports: true,
    aiScreening: true,
    publicJobs: true,
    newOnboarding: false,
  })
  const [passwordSettings, setPasswordSettings] = useState({
    minLength: "10",
    expiry: "90",
    history: "5",
    lockout: "5",
  })
  const [announcement, setAnnouncement] = useState({
    title: "Scheduled maintenance",
    message:
      "CoreRecruiter will be briefly unavailable on Saturday at 02:00 UTC.",
    audience: "All users",
  })

  function saveSettings() {
    setNotice(
      `${tabs.find((item) => item.id === tab)?.label} settings saved successfully.`
    )
  }

  function toggleFeature(key: keyof typeof featureFlags) {
    setFeatureFlags((current) => ({ ...current, [key]: !current[key] }))
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AdminSidebar />
      <main className="min-w-0 flex-1 overflow-y-auto p-5 sm:p-7">
        <div className="mx-auto max-w-350 space-y-6">
          <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
                Platform control
              </p>
            </div>
            <Button onClick={saveSettings}>
              <Save /> Save changes
            </Button>
          </header>
          {notice && (
            <div className="flex items-center justify-between gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-xs text-emerald-700 dark:text-emerald-400">
              <span className="flex items-center gap-2">
                <Check className="size-4" /> {notice}
              </span>
              <button
                type="button"
                onClick={() => setNotice("")}
                aria-label="Dismiss notification"
              >
                <X className="size-4" />
              </button>
            </div>
          )}
          <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
            <Card className="h-fit shadow-sm">
              <CardContent className="space-y-1 p-3">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTab(id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium transition-colors ${tab === id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                  >
                    <Icon className="size-4" />
                    {label}
                  </button>
                ))}
              </CardContent>
            </Card>
            <div className="space-y-5">
              {tab === "general" && (
                <>
                  <Card className="shadow-sm">
                    <CardHeader className="border-b border-border/70 pb-4">
                      <CardTitle>Global application settings</CardTitle>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Brand and regional defaults used throughout the
                        platform.
                      </p>
                    </CardHeader>
                    <CardContent className="grid gap-4 pt-5 sm:grid-cols-2">
                      <label className="space-y-1.5 text-xs font-medium">
                        Application name
                        <Input defaultValue="CoreRecruiter" />
                      </label>
                      <label className="space-y-1.5 text-xs font-medium">
                        Support email
                        <Input
                          defaultValue="support@corerecruiter.com"
                          type="email"
                        />
                      </label>
                      <label className="space-y-1.5 text-xs font-medium">
                        Default timezone
                        <select
                          defaultValue="Europe/London"
                          className="mt-1.5 h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus:border-ring"
                        >
                          <option>Europe/London</option>
                          <option>UTC</option>
                          <option>America/New_York</option>
                        </select>
                      </label>
                      <label className="space-y-1.5 text-xs font-medium">
                        Default language
                        <select
                          defaultValue="English (UK)"
                          className="mt-1.5 h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus:border-ring"
                        >
                          <option>English (UK)</option>
                          <option>English (US)</option>
                        </select>
                      </label>
                    </CardContent>
                  </Card>
                  <Card className="shadow-sm">
                    <CardHeader className="border-b border-border/70 pb-4">
                      <CardTitle>Default notifications</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5 pt-5">
                      <SettingToggle
                        label="New user emails"
                        description="Send welcome and invitation emails when an account is created."
                        value={newUserEmails}
                        onChange={() => setNewUserEmails((value) => !value)}
                      />
                      <SettingToggle
                        label="Security notifications"
                        description="Notify users about password changes, new devices, and suspicious sign-ins."
                        value={securityEmails}
                        onChange={() => setSecurityEmails((value) => !value)}
                      />
                      <SettingToggle
                        label="Weekly platform reports"
                        description="Send platform usage summaries to super administrators every Monday."
                        value={weeklyReports}
                        onChange={() => setWeeklyReports((value) => !value)}
                      />
                    </CardContent>
                  </Card>
                </>
              )}
              {tab === "communications" && (
                <>
                  <Card className="shadow-sm">
                    <CardHeader className="border-b border-border/70 pb-4">
                      <CardTitle>Email and notification templates</CardTitle>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Customize system messages while preserving required
                        security content.
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-5">
                      {[
                        {
                          icon: Mail,
                          title: "User invitation",
                          detail:
                            "Sent when an administrator invites a new user",
                          status: "Published",
                        },
                        {
                          icon: KeyRound,
                          title: "Password reset",
                          detail: "Sent when a user requests a password reset",
                          status: "Published",
                        },
                        {
                          icon: ShieldCheck,
                          title: "Security alert",
                          detail:
                            "Sent after a new device or suspicious sign-in",
                          status: "Published",
                        },
                        {
                          icon: Bell,
                          title: "Announcement notification",
                          detail: "Sent for platform-wide announcements",
                          status: "Draft",
                        },
                      ].map(({ icon: Icon, title, detail, status }) => (
                        <button
                          type="button"
                          key={title}
                          onClick={() =>
                            setNotice(
                              `${title} template editor will open when connected to the email service.`
                            )
                          }
                          className="flex w-full items-center gap-3 rounded-lg border border-border/70 p-3 text-left transition-colors hover:bg-muted/40"
                        >
                          <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Icon className="size-4" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-xs font-semibold">
                              {title}
                            </span>
                            <span className="mt-1 block text-[11px] text-muted-foreground">
                              {detail}
                            </span>
                          </span>
                          <span
                            className={`rounded-full px-2 py-1 text-[10px] font-semibold ${status === "Published" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-amber-500/10 text-amber-700 dark:text-amber-400"}`}
                          >
                            {status}
                          </span>
                          <ChevronDown className="size-4 -rotate-90 text-muted-foreground" />
                        </button>
                      ))}
                    </CardContent>
                  </Card>
                  <Card className="shadow-sm">
                    <CardHeader className="border-b border-border/70 pb-4">
                      <CardTitle>Announcement composer</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-5">
                      <label className="block space-y-1.5 text-xs font-medium">
                        Title
                        <Input
                          value={announcement.title}
                          onChange={(event) =>
                            setAnnouncement({
                              ...announcement,
                              title: event.target.value,
                            })
                          }
                        />
                      </label>
                      <label className="block space-y-1.5 text-xs font-medium">
                        Message
                        <textarea
                          value={announcement.message}
                          onChange={(event) =>
                            setAnnouncement({
                              ...announcement,
                              message: event.target.value,
                            })
                          }
                          className="mt-1.5 min-h-24 w-full rounded-lg border border-input bg-background px-2.5 py-2 text-sm outline-none focus:border-ring"
                        />
                      </label>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <select
                          value={announcement.audience}
                          onChange={(event) =>
                            setAnnouncement({
                              ...announcement,
                              audience: event.target.value,
                            })
                          }
                          className="h-8 rounded-lg border border-input bg-background px-2.5 text-xs outline-none focus:border-ring"
                        >
                          <option>All users</option>
                          <option>Administrators only</option>
                          <option>HR users</option>
                        </select>
                        <Button
                          size="sm"
                          onClick={() =>
                            setNotice(
                              `Announcement scheduled for ${announcement.audience}.`
                            )
                          }
                        >
                          <Megaphone /> Publish announcement
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
              {tab === "security" && (
                <>
                  <Card className="shadow-sm">
                    <CardHeader className="border-b border-border/70 pb-4">
                      <CardTitle>Password policy</CardTitle>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Global rules applied to new and changed passwords.
                      </p>
                    </CardHeader>
                    <CardContent className="grid gap-4 pt-5 sm:grid-cols-2">
                      <label className="space-y-1.5 text-xs font-medium">
                        Minimum length
                        <Input
                          value={passwordSettings.minLength}
                          onChange={(event) =>
                            setPasswordSettings({
                              ...passwordSettings,
                              minLength: event.target.value,
                            })
                          }
                          type="number"
                          min="8"
                        />
                      </label>
                      <label className="space-y-1.5 text-xs font-medium">
                        Password expiry (days)
                        <Input
                          value={passwordSettings.expiry}
                          onChange={(event) =>
                            setPasswordSettings({
                              ...passwordSettings,
                              expiry: event.target.value,
                            })
                          }
                          type="number"
                        />
                      </label>
                      <label className="space-y-1.5 text-xs font-medium">
                        Previous passwords blocked
                        <Input
                          value={passwordSettings.history}
                          onChange={(event) =>
                            setPasswordSettings({
                              ...passwordSettings,
                              history: event.target.value,
                            })
                          }
                          type="number"
                        />
                      </label>
                      <label className="space-y-1.5 text-xs font-medium">
                        Failed attempts before lockout
                        <Input
                          value={passwordSettings.lockout}
                          onChange={(event) =>
                            setPasswordSettings({
                              ...passwordSettings,
                              lockout: event.target.value,
                            })
                          }
                          type="number"
                        />
                      </label>
                    </CardContent>
                  </Card>
                  <Card className="shadow-sm">
                    <CardHeader className="border-b border-border/70 pb-4">
                      <CardTitle>Authentication defaults</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5 pt-5">
                      <SettingToggle
                        label="Require 2FA for administrators"
                        description="Administrators must enroll in two-factor authentication before accessing management areas."
                        value={true}
                        onChange={() =>
                          setNotice(
                            "Manage mandatory 2FA from the Audit & Security center."
                          )
                        }
                      />
                      <SettingToggle
                        label="Block breached passwords"
                        description="Reject passwords found in known compromised-password datasets."
                        value={true}
                        onChange={() =>
                          setNotice(
                            "Breach protection is controlled by the authentication service."
                          )
                        }
                      />
                    </CardContent>
                  </Card>
                </>
              )}
              {tab === "access" && (
                <>
                  <Card className="shadow-sm">
                    <CardHeader className="border-b border-border/70 pb-4">
                      <CardTitle>Supported roles</CardTitle>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Roles available for assignment and invitation links.
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-5">
                      {[
                        {
                          role: "SUPER_ADMIN",
                          detail: "Full platform access",
                          protected: true,
                        },
                        {
                          role: "HR_ADMIN",
                          detail: "Company administration",
                          protected: true,
                        },
                        {
                          role: "HR_MANAGER",
                          detail: "People and hiring management",
                          protected: false,
                        },
                        {
                          role: "RECRUITER",
                          detail: "Recruitment workflows",
                          protected: false,
                        },
                        {
                          role: "EMPLOYEE",
                          detail: "Employee self-service",
                          protected: false,
                        },
                      ].map(({ role, detail, protected: isProtected }) => (
                        <div
                          key={role}
                          className="flex items-center gap-3 rounded-lg border border-border/70 p-3"
                        >
                          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <ShieldCheck className="size-4" />
                          </span>
                          <div className="flex-1">
                            <p className="text-xs font-semibold">{role}</p>
                            <p className="mt-1 text-[11px] text-muted-foreground">
                              {detail}
                            </p>
                          </div>
                          {isProtected && (
                            <span className="text-[10px] font-medium text-muted-foreground">
                              System role
                            </span>
                          )}
                          <Check className="size-4 text-emerald-600" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  <Card className="shadow-sm">
                    <CardHeader className="border-b border-border/70 pb-4">
                      <CardTitle>Invitation rules</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5 pt-5">
                      <SettingToggle
                        label="Require verified email"
                        description="Users must verify their email address before accepting an invitation."
                        value={true}
                        onChange={() =>
                          setNotice("Email verification rule updated.")
                        }
                      />
                      <SettingToggle
                        label="Allow external invitations"
                        description="Permit administrators to invite users outside the company domain."
                        value={false}
                        onChange={() =>
                          setNotice("External invitation rule updated.")
                        }
                      />
                      <SettingToggle
                        label="Expire invitations after 7 days"
                        description="Automatically invalidate unused invitations after one week."
                        value={true}
                        onChange={() =>
                          setNotice("Invitation expiry rule updated.")
                        }
                      />
                    </CardContent>
                  </Card>
                </>
              )}
              {tab === "system" && (
                <>
                  <Card className="shadow-sm">
                    <CardHeader className="border-b border-border/70 pb-4">
                      <CardTitle>Maintenance mode</CardTitle>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Control platform availability during planned operations.
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-5 pt-5">
                      <SettingToggle
                        label="Enable maintenance mode"
                        description="Show a maintenance screen to standard users while allowing super administrators to sign in."
                        value={maintenanceMode}
                        onChange={() => setMaintenanceMode((value) => !value)}
                      />
                      {maintenanceMode && (
                        <div className="rounded-lg border border-amber-500/25 bg-amber-500/5 p-3 text-xs text-amber-800 dark:text-amber-300">
                          Maintenance mode is active. The change will be written
                          to the audit log and displayed in the global status
                          banner.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  <Card className="shadow-sm">
                    <CardHeader className="border-b border-border/70 pb-4">
                      <CardTitle>Feature flags</CardTitle>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Release platform capabilities gradually and roll back
                        without a deployment.
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-5 pt-5">
                      <SettingToggle
                        label="Advanced reports"
                        description="Enable the platform analytics and export experience."
                        value={featureFlags.advancedReports}
                        onChange={() => toggleFeature("advancedReports")}
                      />
                      <SettingToggle
                        label="AI screening"
                        description="Enable AI-assisted candidate screening for eligible companies."
                        value={featureFlags.aiScreening}
                        onChange={() => toggleFeature("aiScreening")}
                      />
                      <SettingToggle
                        label="Public jobs portal"
                        description="Allow companies to publish listings to the public jobs portal."
                        value={featureFlags.publicJobs}
                        onChange={() => toggleFeature("publicJobs")}
                      />
                      <SettingToggle
                        label="New onboarding flow"
                        description="Enable the redesigned company onboarding experience for new accounts."
                        value={featureFlags.newOnboarding}
                        onChange={() => toggleFeature("newOnboarding")}
                      />
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
