// ─────────────────────────────────────────────────────────────────────────────
// Authentication & Authorization — Data Models
// Covers: Identity · Sessions · Tokens · Roles · Permissions
//         Password policy · 2FA · Audit log · Company onboarding · Invitations
// ─────────────────────────────────────────────────────────────────────────────

export type ISODateString = string   // "2026-04-23T09:00:00Z"

export interface ApiResponse<T> {
  data:     T
  message?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// ROLES & PERMISSIONS
// ─────────────────────────────────────────────────────────────────────────────

// The two portals visible in the app
export type Portal = "hr" | "ess"

// Built-in role names (match the security settings page exactly)
export type RoleName = "HR Admin" | "HR Manager" | "Recruiter" | "Employee"

export interface Permission {
  canEdit:   boolean
  canExport: boolean
  canDelete: boolean
}

export interface Role {
  id:          number
  name:        RoleName
  portal:      Portal
  permissions: Permission
  isSystem:    boolean   // true = cannot be deleted
  createdAt:   ISODateString
}

// GET  /api/auth/roles              → ApiResponse<Role[]>
// PUT  /api/auth/roles/:id          → ApiResponse<Role>   (update permissions only)

// ─────────────────────────────────────────────────────────────────────────────
// USER ACCOUNT
// ─────────────────────────────────────────────────────────────────────────────

export type AccountStatus = "active" | "invited" | "suspended" | "deactivated"

export interface UserAccount {
  id:              number
  email:           string
  name:            string
  avatarUrl?:      string
  roleId:          number          // FK → Role.id
  roleName:        RoleName        // denormalised
  portal:          Portal
  employeeId?:     number          // FK → Employee.id  (null for HR-only accounts)
  companyId:       number          // FK → Company.id
  status:          AccountStatus
  emailVerified:   boolean
  twoFAEnabled:    boolean
  lastLoginAt?:    ISODateString
  createdAt:       ISODateString
}

// GET  /api/auth/me                  → ApiResponse<UserAccount>
// PATCH /api/auth/me                 → ApiResponse<UserAccount>  (name, avatar)

// ─────────────────────────────────────────────────────────────────────────────
// REGISTRATION / SIGN-UP
// ─────────────────────────────────────────────────────────────────────────────

export interface SignUpBody {
  name:            string
  email:           string
  password:        string
  confirmPassword: string
  portal:          Portal        // "hr" | "ess"
}

export interface SignUpResponse {
  user:    UserAccount
  message: string               // "Check your email to verify your account"
}

// POST /api/auth/signup  → ApiResponse<SignUpResponse>

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL VERIFICATION
// ─────────────────────────────────────────────────────────────────────────────

export interface VerifyEmailBody {
  token: string     // one-time token from the verification email link
}

export interface ResendVerificationBody {
  email: string
}

// POST /api/auth/verify-email          → ApiResponse<{ message: string }>
// POST /api/auth/resend-verification   → ApiResponse<{ message: string }>

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────────────────────────────────────

export interface LoginBody {
  email:    string
  password: string
  portal:   Portal
}

export interface LoginResponse {
  accessToken:  string         // short-lived JWT (15 min)
  refreshToken: string         // long-lived (7 days), httpOnly cookie
  user:         UserAccount
  requiresTwoFA: boolean       // true → client must call /auth/2fa/verify next
}

// POST /api/auth/login              → ApiResponse<LoginResponse>

// ── Google OAuth ──────────────────────────────────────────────────────────────

export interface OAuthCallbackBody {
  code:   string   // authorisation code from Google
  portal: Portal
}

// GET  /api/auth/google                          → redirect to Google consent
// GET  /api/auth/google/callback?code=…&state=… → ApiResponse<LoginResponse>

// ─────────────────────────────────────────────────────────────────────────────
// TOKEN MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────

export interface RefreshTokenBody {
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken:  string
  refreshToken: string   // rotated
}

export interface LogoutBody {
  refreshToken: string   // invalidate this specific token
}

// POST /api/auth/refresh    → ApiResponse<RefreshTokenResponse>
// POST /api/auth/logout     → ApiResponse<{ message: string }>

// ─────────────────────────────────────────────────────────────────────────────
// TWO-FACTOR AUTHENTICATION (TOTP / Authenticator app)
// ─────────────────────────────────────────────────────────────────────────────

export interface TwoFASetupResponse {
  secret:     string    // base32 seed for authenticator app
  qrCodeUrl:  string    // otpauth:// URI encoded as a QR data URL
  backupCodes: string[] // one-time recovery codes (show once, store hashed)
}

export interface TwoFAVerifyBody {
  code:        string   // 6-digit TOTP code
  sessionToken?: string // temporary token issued by login when requiresTwoFA=true
}

export interface TwoFARecoveryBody {
  backupCode: string
}

export interface TwoFADisableBody {
  password: string      // require current password to disable 2FA
}

// POST /api/auth/2fa/setup    → ApiResponse<TwoFASetupResponse>  (enrolment)
// POST /api/auth/2fa/enable   → ApiResponse<{ message: string }> (confirm setup)
// POST /api/auth/2fa/verify   → ApiResponse<LoginResponse>       (complete login)
// POST /api/auth/2fa/disable  → ApiResponse<{ message: string }>
// POST /api/auth/2fa/recover  → ApiResponse<LoginResponse>       (backup code login)

// ─────────────────────────────────────────────────────────────────────────────
// PASSWORD MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────

export interface ForgotPasswordBody {
  email: string
}

export interface ResetPasswordBody {
  token:           string   // one-time token from reset email link
  password:        string
  confirmPassword: string
}

export interface ChangePasswordBody {
  currentPassword: string
  newPassword:     string
  confirmPassword: string
}

// POST /api/auth/forgot-password   → ApiResponse<{ message: string }>
// POST /api/auth/reset-password    → ApiResponse<{ message: string }>
// POST /api/auth/change-password   → ApiResponse<{ message: string }>

// ─────────────────────────────────────────────────────────────────────────────
// SESSION
// ─────────────────────────────────────────────────────────────────────────────

export interface Session {
  id:          string
  userId:      number
  device:      string          // "Chrome on Windows"
  ipAddress:   string
  location?:   string          // "Accra, Ghana"
  createdAt:   ISODateString
  lastActiveAt: ISODateString
  isCurrent:   boolean
}

// GET    /api/auth/sessions           → ApiResponse<Session[]>
// DELETE /api/auth/sessions/:id       → ApiResponse<{ message: string }>  (revoke one)
// DELETE /api/auth/sessions           → ApiResponse<{ message: string }>  (revoke all except current)

// ─────────────────────────────────────────────────────────────────────────────
// EMPLOYEE INVITATIONS
// ─────────────────────────────────────────────────────────────────────────────

export type InvitationStatus = "pending" | "accepted" | "expired" | "revoked"

export interface Invitation {
  id:          number
  email:       string
  name?:       string
  roleId:      number
  roleName:    RoleName
  companyId:   number
  invitedById: number          // FK → UserAccount.id
  status:      InvitationStatus
  token:       string          // sent in the invite email link
  expiresAt:   ISODateString
  acceptedAt?: ISODateString
  createdAt:   ISODateString
}

export interface SendInvitationBody {
  email:  string
  name?:  string
  roleId: number
}

export interface BulkInviteBody {
  invitations: SendInvitationBody[]
}

export interface AcceptInvitationBody {
  token:           string
  name:            string
  password:        string
  confirmPassword: string
}

// GET  /api/auth/invitations                     → ApiResponse<Invitation[]>
// POST /api/auth/invitations                     → ApiResponse<Invitation>
// POST /api/auth/invitations/bulk                → ApiResponse<{ sent: number; failed: string[] }>
// DELETE /api/auth/invitations/:id               → ApiResponse<{ message: string }>  (revoke)
// POST /api/auth/invitations/accept              → ApiResponse<LoginResponse>

// ─────────────────────────────────────────────────────────────────────────────
// SECURITY SETTINGS  (HR Admin — /settings/security)
// ─────────────────────────────────────────────────────────────────────────────

export interface PasswordPolicy {
  minLength:        number    // chars (default 8)
  expiryDays:       number    // 0 = never
  requireUppercase: boolean
  requireNumber:    boolean
  requireSpecial:   boolean
}

export interface AuthSettings {
  requireTwoFA:       boolean   // enforce 2FA on all HR admin accounts
  sessionTimeoutMins: number    // auto-logout after N minutes of inactivity
}

export interface DataPrivacySettings {
  gdprMode:            boolean  // enforce GDPR right-to-erasure & data minimisation
  retentionMonths:     number   // auto-purge inactive data after N months
  auditLogEnabled:     boolean
  restrictExport:      boolean  // only HR Admin can export data
}

export interface SecuritySettings {
  auth:          AuthSettings
  passwordPolicy: PasswordPolicy
  dataPrivacy:   DataPrivacySettings
  roles:         Role[]
}

// GET  /api/auth/settings/security          → ApiResponse<SecuritySettings>
// PUT  /api/auth/settings/security          → ApiResponse<SecuritySettings>
// PUT  /api/auth/settings/security/auth     → ApiResponse<AuthSettings>
// PUT  /api/auth/settings/security/password → ApiResponse<PasswordPolicy>
// PUT  /api/auth/settings/security/privacy  → ApiResponse<DataPrivacySettings>

// ─────────────────────────────────────────────────────────────────────────────
// AUDIT LOG
// ─────────────────────────────────────────────────────────────────────────────

export type AuditAction =
  | "login" | "logout" | "login_failed" | "password_changed" | "password_reset"
  | "2fa_enabled" | "2fa_disabled" | "2fa_failed"
  | "user_invited" | "invitation_accepted" | "invitation_revoked"
  | "role_updated" | "user_suspended" | "user_reactivated"
  | "settings_changed" | "data_exported" | "session_revoked"

export interface AuditLogEntry {
  id:         number
  actorId:    number           // FK → UserAccount.id
  actorName:  string           // denormalised
  action:     AuditAction
  targetId?:  number           // e.g. affected user's ID
  targetName?: string
  ipAddress:  string
  device?:    string
  metadata?:  Record<string, unknown>   // extra context (changed fields, etc.)
  occurredAt: ISODateString
}

// GET /api/auth/audit-log                    → PaginatedResponse<AuditLogEntry>
//   ?action=login&actorId=1&from=…&to=…

// ─────────────────────────────────────────────────────────────────────────────
// COMPANY ONBOARDING  (/onboarding/company-info)
// ─────────────────────────────────────────────────────────────────────────────

export interface CompanyBasicInfo {
  name:        string
  industry:    string
  size:        string       // "1–10" | "11–50" | "51–200" | "201–500" | "500+"
  logoUrl?:    string
  website?:    string
}

export interface CompanyAddress {
  country:    string
  city:       string
  timezone:   string        // IANA tz e.g. "Africa/Accra"
  address?:   string
}

export interface CompanyStructure {
  departments: string[]
  roles:       string[]
  offices:     string[]
}

export interface OnboardingInvite {
  email:   string
  roleId:  number
}

export interface CompanyOnboardingBody {
  basicInfo:  CompanyBasicInfo
  address:    CompanyAddress
  structure:  CompanyStructure
  invites:    OnboardingInvite[]
}

export interface Company {
  id:        number
  name:      string
  industry:  string
  size:      string
  logoUrl?:  string
  website?:  string
  country:   string
  city:      string
  timezone:  string
  address?:  string
  createdAt: ISODateString
}

// POST /api/auth/onboarding   → ApiResponse<{ company: Company; invitesSent: number }>
// GET  /api/auth/company      → ApiResponse<Company>
// PUT  /api/auth/company      → ApiResponse<Company>
