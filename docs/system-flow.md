# CoreRecruiter System Flow

```mermaid
flowchart TD
    Visitor([Visitor]) --> Root[Next.js App Router]
    Root --> PublicJobs[Public jobs portal]
    Root --> StaffAuth[Staff authentication]
    Root --> ApplicantAuth[Applicant authentication]

    subgraph PublicRecruiting[Public recruiting flow]
        PublicJobs --> JobLanding[Jobs landing page]
        JobLanding --> JobListing[Search and filter open jobs]
        JobListing --> JobDetails[Job details]
        JobDetails --> ApplyDecision{Applicant signed in?}
        ApplyDecision -- No --> GuestChoice[Guest apply or applicant login]
        ApplyDecision -- Yes --> QuickApply[Quick apply with saved profile]
        GuestChoice --> FullApplication[Five-step application form]
        JobDetails --> FullApplication
        FullApplication --> Uploads[Upload resume and profile assets]
        Uploads --> SubmitApplication[Submit application]
        QuickApply --> SubmitApplication
        SubmitApplication --> ApplicationAPI[(Applications API)]
        ApplicationAPI --> ApplicationStatus[Application status and screening]

        ApplicantAuth --> ApplicantLogin[Applicant login or signup]
        ApplicantLogin --> ApplicantToken[Applicant access and refresh tokens]
        ApplicantToken --> ApplicantProfile[Applicant profile and applications]
        ApplicantProfile --> JobListing
        ApplicantProfile --> QuickApply
        ApplicantProfile --> ApplicationStatus
    end

    subgraph StaffAccess[Staff access and routing]
        StaffAuth --> StaffLogin[Staff login, Google login, or signup]
        StaffLogin --> VerifyEmail[Email verification when required]
        VerifyEmail --> StaffSession[Store staff access token, refresh token, and user]
        StaffLogin --> StaffSession
        StaffSession --> PasswordGate{Must change password?}
        PasswordGate -- Yes --> ChangePassword[Change password]
        ChangePassword --> RoleRouter{Resolve role}
        PasswordGate -- No --> RoleRouter
        RoleRouter -- SUPER_ADMIN --> AdminPortal[Admin dashboard]
        RoleRouter -- HR_ADMIN first login --> Onboarding[Company onboarding]
        Onboarding --> CompanySetup[Company, locations, departments, invitations]
        CompanySetup --> HRPortal[HR dashboard]
        RoleRouter -- HR_ADMIN returning --> HRPortal
        RoleRouter -- HR_MANAGER or RECRUITER --> HRPortal
        RoleRouter -- EMPLOYEE --> ESSPortal[Employee self-service]
    end

    subgraph ProtectedPortals[Protected application areas]
        AdminPortal --> AdminFeatures[Platform overview, users, roles, settings, audit logs]
        HRPortal --> HRFeatures[People, departments, jobs, applicants, evaluation, interviews, leave, payroll, reports]
        ESSPortal --> ESSFeatures[Attendance, profile, leave, payroll, payslips, announcements]

        AdminFeatures --> AdminAPI[(Admin API)]
        HRFeatures --> HRAPI[(HR and recruiting APIs)]
        ESSFeatures --> ESSAPI[(Employee self-service APIs)]
    end

    subgraph SharedRuntime[Shared runtime]
        Root --> Theme[ThemeProvider]
        Root --> StaffContext[AuthProvider]
        ApplicantAuth --> ApplicantContext[ApplicantAuthProvider]
        StaffContext --> RequireAuth[RequireAuth guard]
        RequireAuth --> ProtectedPortals
        ApplicantContext --> ApplicantGuard[Applicant auth guard where required]
        StaffSession --> ApiClient[Authenticated API client]
        ApplicantToken --> ApiClient
        ApiClient --> Backend[(CoreRecruiter backend)]
        ApplicationAPI --> Backend
        AdminAPI --> Backend
        HRAPI --> Backend
        ESSAPI --> Backend
        Backend --> Storage[(Database and uploaded assets)]
    end

    StaffAuth --> AuthAPI[(Auth API)]
    ApplicantLogin --> ApplicantAPI[(Applicant auth API)]
    AuthAPI --> Backend
    ApplicantAPI --> Backend
```

## Main routes

- Public recruiting: `/jobs`, `/jobs/(listing)/job-listing`, `/apply/[id]`, and `/apply/apply`.
- Staff authentication: `/auth/login`, `/auth/signup`, email verification, password reset, and password change.
- Company setup: `/onboarding` and `/onboarding/company-info` for a first-time HR admin.
- Admin portal: `/dashboard/admin` and its platform-management sections.
- HR portal: `/dashboard/hr` and its people, hiring, payroll, leave, and reporting sections.
- Employee portal: `/dashboard/ess`, which redirects to `/dashboard/ess/attendance`.

## Data boundary

The UI calls domain services under `services/`, which use `lib/api-client.ts` to reach the backend. Staff and applicant sessions use separate token storage and auth contexts. Protected layouts enforce access on the client before rendering their portal shell.
