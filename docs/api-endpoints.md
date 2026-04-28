# Core Recruiter — API Endpoints Reference

**Base URL:** `process.env.NEXT_PUBLIC_API_URL` (default: `http://localhost:5000`)

All endpoints return JSON. Authenticated endpoints expect a `Bearer <token>` header unless noted otherwise. Date strings use ISO 8601 (`YYYY-MM-DD` or full `YYYY-MM-DDTHH:mm:ssZ`). IDs are strings (UUIDs) unless noted as numbers.

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [Onboarding](#2-onboarding)
3. [Employees](#3-employees)
4. [Skills](#4-skills-per-employee)
5. [Departments](#5-departments)
6. [Office Locations](#6-office-locations)
7. [Job Listings](#7-job-listings)
8. [Applicants & Candidates](#8-applicants--candidates)
9. [Candidate Evaluation](#9-candidate-evaluation)
10. [Interview Scheduling](#10-interview-scheduling)
11. [Leave Management](#11-leave-management)
12. [Attendance](#12-attendance)
13. [Payroll](#13-payroll)
14. [Calendar Events](#14-calendar-events)
15. [Announcements](#15-announcements)
16. [Reports](#16-reports)
17. [Complaints](#17-complaints)
18. [Documents](#18-documents)
19. [Settings — Company](#19-settings--company)
20. [Settings — Leave Policy](#20-settings--leave-policy)
21. [Settings — Payroll Config](#21-settings--payroll-config)
22. [Settings — Security & Roles](#22-settings--security--roles)
23. [Settings — Notifications](#23-settings--notifications)
24. [Notifications (in-app)](#24-notifications-in-app)
25. [Admin — User Management](#25-admin--user-management)
26. [File Upload](#26-file-upload)

---

## 1. Authentication

### POST `/auth/login`
Sign in with email and password. Returns an access token.

**Request body**
```json
{
  "email": "admin@company.com",
  "password": "secret"
}
```

**Response `200`**
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "user": {
    "id": "uuid",
    "email": "admin@company.com",
    "fullName": "Frank Gbadago",
    "role": "HR_ADMIN"
  }
}
```

---

### POST `/auth/signup`
Create a new admin account.

**Request body**
```json
{
  "email": "admin@company.com",
  "password": "secret",
  "confirmPassword": "secret",
  "fullName": "Frank Gbadago"
}
```

**Response `201`** — same shape as login response.

---

### POST `/auth/reset-password/request`
Send a password-reset email.

**Request body**
```json
{ "email": "admin@company.com" }
```

**Response `200`**
```json
{ "message": "Reset link sent" }
```

---

### POST `/auth/reset-password/confirm`
Complete the password reset using the token from the email link.

**Request body**
```json
{
  "token": "reset-token-from-email",
  "newPassword": "newSecret",
  "confirmPassword": "newSecret"
}
```

**Response `200`**
```json
{ "message": "Password updated" }
```

---

### POST `/auth/verify-email`
Verify an email address using the code sent on signup.

**Request body**
```json
{ "code": "6-digit-otp" }
```

**Response `200`**
```json
{ "message": "Email verified" }
```

---

### POST `/auth/refresh`
Exchange a refresh token for a new access token.

**Request body**
```json
{ "refreshToken": "eyJ..." }
```

**Response `200`**
```json
{ "accessToken": "eyJ..." }
```

---

### POST `/auth/logout`
Invalidate the current refresh token.

**Response `204`** — no body.

---

## 2. Onboarding

### POST `/hr-admin/onboard/company`
Create the company profile during initial onboarding.

**Request body**
```json
{
  "name": "Acme Corp",
  "industry": "Technology",
  "size": "51-200",
  "website": "https://acme.com",
  "timezone": "UTC+0",
  "currency": "USD",
  "fiscalYearStart": "January"
}
```

**Response `201`**
```json
{
  "id": "uuid",
  "name": "Acme Corp",
  "industry": "Technology"
}
```

---

### POST `/hr-admin/onboard/employee`
Create a single employee during onboarding.

**Request body** — see [Employee create body](#post-employee-managementemployees).

**Response `201`** — Employee object.

---

### POST `/hr-admin/onboard/employees/bulk`
Import multiple employees at once.

**Request body**
```json
{
  "employees": [ /* array of employee create bodies */ ]
}
```

**Response `201`**
```json
{
  "created": 12,
  "failed": 0,
  "errors": []
}
```

---

### PATCH `/hr-admin/onboard/assign-role`
Assign an HR role to an admin user.

**Request body**
```json
{
  "userId": "uuid",
  "role": "HR_MANAGER"
}
```

**Response `200`** — updated user object.

---

## 3. Employees

### GET `/employee-management/employees`
List all employees with optional filtering and pagination.

**Query params**
| Param | Type | Description |
|---|---|---|
| `page` | number | Page number (default `1`) |
| `limit` | number | Items per page (default `20`) |
| `search` | string | Filter by name or email |
| `departmentId` | string | Filter by department |
| `employmentType` | string | `FULL_TIME` \| `PART_TIME` \| `CONTRACT` \| `INTERN` |
| `isActive` | boolean | Filter active/inactive |

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "employeeId": "EMP-001",
      "name": "Sarah Johnson",
      "email": "sarah@company.com",
      "jobTitle": "UI Designer",
      "employmentType": "FULL_TIME",
      "department": { "id": "uuid", "name": "Design" },
      "officeLocation": { "id": "uuid", "name": "HQ" },
      "phone": "+1 555 0100",
      "joinDate": "2024-01-15",
      "isActive": true
    }
  ],
  "total": 42,
  "page": 1,
  "limit": 20
}
```

---

### GET `/employee-management/employees/:id`
Get a single employee's full profile.

**Response `200`** — full Employee object including `bio`, `skills`, `endDate`.

---

### POST `/employee-management/employees`
Create a new employee.

**Request body**
```json
{
  "name": "Sarah Johnson",
  "email": "sarah@company.com",
  "jobTitle": "UI Designer",
  "employmentType": "FULL_TIME",
  "departmentId": "uuid",
  "officeLocationId": "uuid",
  "phone": "+1 555 0100",
  "bio": "Short bio…",
  "joinDate": "2024-01-15"
}
```

**Response `201`** — created Employee object.

---

### PATCH `/employee-management/employees/:id`
Update an employee's details. All fields are optional.

**Request body** — partial Employee fields.

**Response `200`** — updated Employee object.

---

### DELETE `/employee-management/employees/:id`
Deactivate (soft-delete) an employee.

**Response `200`**
```json
{ "message": "Employee deactivated" }
```

---

## 4. Skills (per Employee)

### GET `/employee-management/employees/:id/skills`
List all skills for an employee.

**Response `200`**
```json
[
  { "id": "uuid", "skill": "Figma", "level": "Expert" }
]
```

---

### POST `/employee-management/employees/:id/skills`
Add a skill to an employee.

**Request body**
```json
{ "skill": "TypeScript", "level": "Advanced" }
```

**Response `201`** — created Skill object.

---

### PATCH `/employee-management/employees/:employeeId/skills/:skillId`
Update a skill entry.

**Request body**
```json
{ "level": "Expert" }
```

**Response `200`** — updated Skill object.

---

### DELETE `/employee-management/employees/:employeeId/skills/:skillId`
Remove a skill from an employee.

**Response `204`** — no body.

---

## 5. Departments

### GET `/employee-management/departments`
List all departments.

**Query params** — `search`, `page`, `limit`.

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Engineering",
      "description": "Builds the product",
      "headEmployee": { "id": "uuid", "name": "Tiger Nixon" },
      "memberCount": 14
    }
  ],
  "total": 6
}
```

---

### GET `/employee-management/departments/:id`
Get a single department with its member list.

**Response `200`** — Department object including `members: Employee[]`.

---

### POST `/employee-management/departments`
Create a department.

**Request body**
```json
{
  "name": "Engineering",
  "description": "Builds the product",
  "headEmployeeId": "uuid"
}
```

**Response `201`** — created Department object.

---

### PATCH `/employee-management/departments/:id`
Update a department.

**Request body** — partial Department fields.

**Response `200`** — updated Department object.

---

### DELETE `/employee-management/departments/:id`
Delete a department.

**Response `200`**
```json
{ "message": "Department deleted" }
```

---

### POST `/employee-management/departments/:id/members`
Add an employee to a department.

**Request body**
```json
{ "employeeId": "uuid" }
```

**Response `200`** — updated member list.

---

### DELETE `/employee-management/departments/:departmentId/members/:employeeId`
Remove an employee from a department.

**Response `200`** — updated member list.

---

## 6. Office Locations

### GET `/employee-management/office-locations`
List all office locations.

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "London HQ",
      "type": "HQ",
      "address": "1 King St",
      "city": "London",
      "country": "UK",
      "workingDays": ["Mon","Tue","Wed","Thu","Fri"],
      "workStart": "09:00",
      "workEnd": "17:00"
    }
  ]
}
```

---

### GET `/employee-management/office-locations/:id`
Get a single location.

---

### POST `/employee-management/office-locations`
Create a location.

**Request body**
```json
{
  "name": "London HQ",
  "type": "HQ",
  "address": "1 King St",
  "city": "London",
  "country": "UK",
  "workingDays": ["Mon","Tue","Wed","Thu","Fri"],
  "workStart": "09:00",
  "workEnd": "17:00"
}
```

**Response `201`** — created Location object.

---

### PATCH `/employee-management/office-locations/:id`
Update a location.

---

### DELETE `/employee-management/office-locations/:id`
Delete a location.

---

## 7. Job Listings

### GET `/recruitment/jobs`
List job postings.

**Query params**
| Param | Type | Description |
|---|---|---|
| `search` | string | Filter by title or department |
| `status` | string | `Open` \| `Closed` \| `Draft` |
| `department` | string | Department name |
| `type` | string | `Full-time` \| `Part-time` \| `Contract` \| `Internship` |
| `level` | string | `Junior` \| `Mid-level` \| `Senior` \| `Lead` |
| `page` | number | |
| `limit` | number | |

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Backend Developer",
      "department": "Engineering",
      "type": "Full-time",
      "level": "Senior",
      "location": "Remote",
      "salaryMin": 80000,
      "salaryMax": 120000,
      "currency": "USD",
      "status": "Open",
      "openings": 2,
      "applicantCount": 18,
      "deadline": "2026-05-31",
      "postedDate": "2026-04-01",
      "skills": ["Node.js","PostgreSQL","Docker"]
    }
  ],
  "total": 9,
  "page": 1
}
```

---

### GET `/recruitment/jobs/:id`
Get full job detail including description, responsibilities, requirements, and recent applicants.

**Response `200`** — full Job object.

---

### POST `/recruitment/jobs`
Create a job listing (all three wizard steps combined).

**Request body**
```json
{
  "title": "Backend Developer",
  "department": "Engineering",
  "type": "Full-time",
  "level": "Senior",
  "location": "Remote",
  "salaryMin": 80000,
  "salaryMax": 120000,
  "currency": "USD",
  "experience": "5+ years",
  "openings": 2,
  "deadline": "2026-05-31",
  "description": "We are looking for…",
  "responsibilities": ["Design scalable APIs", "…"],
  "requirements": ["5+ years Node.js", "…"],
  "niceToHave": ["Kubernetes experience"],
  "skills": ["Node.js","PostgreSQL","Docker"]
}
```

**Response `201`** — created Job object.

---

### PATCH `/recruitment/jobs/:id`
Update a job listing.

**Request body** — partial Job fields.

**Response `200`** — updated Job object.

---

### PATCH `/recruitment/jobs/:id/status`
Change a job's status (e.g., close a listing).

**Request body**
```json
{ "status": "Closed" }
```

**Response `200`** — updated Job object.

---

### DELETE `/recruitment/jobs/:id`
Delete a job listing.

**Response `200`**
```json
{ "message": "Job listing deleted" }
```

---

## 8. Applicants & Candidates

### GET `/recruitment/applicants`
List all applicants across all jobs.

**Query params** — `search`, `jobId`, `page`, `limit`.

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Tiger Nixon",
      "email": "tiger@gmail.com",
      "phone": "+1 555 0100",
      "location": "Tokyo, Japan",
      "jobTitle": "Backend Developer",
      "jobId": "uuid",
      "appliedAt": "2025-01-01",
      "status": "Pending Review",
      "linkedIn": "https://linkedin.com/in/tigernixon",
      "portfolio": "https://tigernixon.dev"
    }
  ],
  "total": 35
}
```

---

### GET `/recruitment/applicants/:id`
Get a single applicant's full profile including education, experience, documents, and AI score.

**Response `200`** — full Applicant/Candidate object.

---

### POST `/recruitment/jobs/:jobId/apply`
Submit a job application (public endpoint — no auth required).

**Request body** (`multipart/form-data`)
```
name: Tiger Nixon
email: tiger@gmail.com
phone: +1 555 0100
location: Tokyo, Japan
linkedIn: https://linkedin.com/in/tigernixon
portfolio: https://tigernixon.dev
coverLetter: <text>
resume: <file>
```

**Response `201`**
```json
{ "id": "uuid", "message": "Application submitted" }
```

---

## 9. Candidate Evaluation

### GET `/recruitment/evaluations`
List candidates with their evaluation status and AI scores.

**Query params** — `search`, `status`, `department`, `page`, `limit`.

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Tiger Nixon",
      "photo": "url",
      "position": "Backend Developer",
      "department": "Engineering",
      "aiScore": 94,
      "status": "Approved",
      "appliedAt": "2025-01-01"
    }
  ],
  "total": 11
}
```

---

### GET `/recruitment/evaluations/:id`
Get full evaluation profile including skills, experience, education, and documents.

---

### PATCH `/recruitment/evaluations/:id/status`
Update a candidate's evaluation status.

**Request body**
```json
{ "status": "Interview" }
```

Valid statuses: `Pending Review` | `Interview` | `Accepted` | `Approved` | `Rejected`

**Response `200`** — updated Evaluation object.

---

### GET `/recruitment/evaluations/:id/documents/:docName`
Download a candidate's submitted document (resume, cover letter, portfolio).

**Response `200`** — file stream.

---

## 10. Interview Scheduling

### GET `/recruitment/interviews`
List all scheduled interviews.

**Query params** — `candidateId`, `from` (date), `to` (date), `page`, `limit`.

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Technical Screen — Tiger Nixon",
      "candidateId": "uuid",
      "candidateName": "Tiger Nixon",
      "date": "2026-04-25",
      "startTime": "10:00",
      "endTime": "11:00",
      "guests": ["hr@company.com", "cto@company.com"],
      "meetLink": "https://meet.google.com/abc-def",
      "description": "First-round technical interview",
      "colorIdx": 2
    }
  ]
}
```

---

### POST `/recruitment/interviews`
Schedule a new interview.

**Request body**
```json
{
  "title": "Technical Screen — Tiger Nixon",
  "candidateId": "uuid",
  "date": "2026-04-25",
  "startTime": "10:00",
  "endTime": "11:00",
  "guests": ["hr@company.com"],
  "meetLink": "https://meet.google.com/abc-def",
  "description": "First-round technical interview"
}
```

**Response `201`** — created Interview object.

---

### PATCH `/recruitment/interviews/:id`
Update an interview.

**Request body** — partial Interview fields.

**Response `200`** — updated Interview object.

---

### DELETE `/recruitment/interviews/:id`
Cancel/delete an interview.

**Response `200`**
```json
{ "message": "Interview cancelled" }
```

---

## 11. Leave Management

### HR endpoints

#### GET `/employee-management/leave-requests`
List all leave requests company-wide.

**Query params**
| Param | Type | Description |
|---|---|---|
| `search` | string | Filter by employee name |
| `type` | string | `ANNUAL` \| `SICK` \| `MATERNITY` \| `PATERNITY` \| `UNPAID` \| `OTHER` |
| `status` | string | `PENDING` \| `APPROVED` \| `REJECTED` \| `CANCELLED` |
| `employeeId` | string | Filter by employee |
| `from` | date | Start of date range |
| `to` | date | End of date range |
| `page` | number | |
| `limit` | number | |

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "employee": { "id": "uuid", "name": "Sarah Johnson", "jobTitle": "UI Designer" },
      "type": "ANNUAL",
      "startDate": "2026-03-18",
      "endDate": "2026-03-20",
      "days": 3,
      "reason": "Family vacation",
      "status": "APPROVED",
      "createdAt": "2026-03-01T09:00:00Z"
    }
  ],
  "total": 24
}
```

---

#### GET `/employee-management/leave-requests/:id`
Get a single leave request.

---

#### POST `/employee-management/leave-requests`
Create a leave request (HR submitting on behalf of an employee).

**Request body**
```json
{
  "employeeId": "uuid",
  "type": "ANNUAL",
  "startDate": "2026-03-18",
  "endDate": "2026-03-20",
  "reason": "Family vacation"
}
```

**Response `201`** — created LeaveRequest object.

---

#### PATCH `/employee-management/leave-requests/:id/status`
Approve or reject a leave request.

**Request body**
```json
{ "status": "APPROVED", "note": "Enjoy your vacation!" }
```

**Response `200`** — updated LeaveRequest object.

---

#### DELETE `/employee-management/leave-requests/:id`
Cancel a leave request.

**Response `200`**
```json
{ "message": "Leave request cancelled" }
```

---

### ESS (Employee Self-Service) endpoints

#### GET `/ess/leave-requests`
Get the authenticated employee's own leave requests.

**Query params** — `status`, `page`, `limit`.

**Response `200`** — same structure as HR list, scoped to the current employee.

---

#### GET `/ess/leave-balance`
Get the authenticated employee's leave balance.

**Response `200`**
```json
[
  { "type": "Annual", "total": 14, "used": 5, "remaining": 9 },
  { "type": "Sick",   "total": 10, "used": 3, "remaining": 7 }
]
```

---

#### POST `/ess/leave-requests`
Submit a leave request as the authenticated employee.

**Request body**
```json
{
  "type": "ANNUAL",
  "startDate": "2026-03-18",
  "endDate": "2026-03-20",
  "reason": "Family vacation"
}
```

**Response `201`** — created LeaveRequest object.

---

## 12. Attendance

### ESS endpoints

#### GET `/ess/attendance`
Get the authenticated employee's attendance history.

**Query params** — `from` (date), `to` (date), `page`, `limit`.

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "date": "2026-04-21",
      "clockIn": "09:00",
      "clockOut": "18:30",
      "hoursWorked": 9.5,
      "status": "Present"
    }
  ],
  "total": 20
}
```

---

#### POST `/ess/attendance/clock-in`
Record a clock-in for the current employee.

**Response `201`**
```json
{
  "id": "uuid",
  "date": "2026-04-22",
  "clockIn": "09:05",
  "status": "Present"
}
```

---

#### PATCH `/ess/attendance/:id/clock-out`
Record a clock-out for an existing attendance record.

**Response `200`**
```json
{
  "id": "uuid",
  "clockOut": "18:30",
  "hoursWorked": 9.4
}
```

---

### HR endpoints

#### GET `/employee-management/attendance`
Get attendance records company-wide.

**Query params** — `employeeId`, `from`, `to`, `page`, `limit`.

**Response `200`** — same as ESS but includes employee details.

---

## 13. Payroll

### HR endpoints

#### GET `/payroll/payroll-runs`
List payroll runs by period.

**Query params** — `month` (1-12), `year`, `page`, `limit`.

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "period": "2026-04",
      "totalPayroll": 117449,
      "totalGross": 157723,
      "totalDeductions": 40274,
      "employeeCount": 9,
      "status": "Completed",
      "runDate": "2026-04-28"
    }
  ]
}
```

---

#### GET `/payroll/employees`
List all employees with their payroll data for the current period.

**Query params** — `period` (YYYY-MM), `search`, `department`, `page`, `limit`.

**Response `200`**
```json
{
  "data": [
    {
      "employeeId": "uuid",
      "name": "Michael Chen",
      "email": "michael@company.com",
      "department": "Design",
      "baseSalary": 9500,
      "bonus": 1200,
      "deductions": 2150,
      "netPay": 8550,
      "status": "Paid"
    }
  ],
  "summary": {
    "totalPayroll": 117449,
    "totalGross": 157723,
    "totalDeductions": 40274
  }
}
```

---

#### POST `/payroll/run`
Trigger a payroll run for a given period.

**Request body**
```json
{ "period": "2026-04" }
```

**Response `201`** — created PayrollRun object.

---

#### GET `/payroll/employees/:employeeId/payslip`
Get a specific employee's payslip for a period.

**Query params** — `period` (YYYY-MM).

**Response `200`** — Payslip object.

---

### ESS endpoints

#### GET `/ess/payroll/summary`
Get the authenticated employee's current compensation summary.

**Response `200`**
```json
{
  "baseSalary": 4500,
  "totalAllowances": 530,
  "totalDeductions": 720,
  "netPay": 4310,
  "currency": "USD",
  "period": "2026-04"
}
```

---

#### GET `/ess/payroll/allowances`
List all allowance components for the authenticated employee.

**Response `200`**
```json
[
  {
    "id": "uuid",
    "name": "Transport Allowance",
    "category": "Travel",
    "amount": 200,
    "frequency": "Monthly",
    "effective": "2026-01-01",
    "status": "Active",
    "note": "Fixed monthly transport subsidy"
  }
]
```

---

#### GET `/ess/payroll/tax`
Get tax deduction breakdown for the authenticated employee.

**Query params** — `year`.

**Response `200`**
```json
{
  "year": 2026,
  "grossIncome": 54000,
  "taxableIncome": 48000,
  "incomeTax": 9600,
  "socialSecurity": 3360,
  "healthInsurance": 1440,
  "totalDeductions": 14400,
  "netIncome": 39600,
  "brackets": [
    { "range": "$0 – $10,000",   "rate": "0%",  "taxDue": 0     },
    { "range": "$10,001 – $40,000", "rate": "20%", "taxDue": 6000 }
  ]
}
```

---

#### GET `/ess/payroll/payslips`
List payslip history for the authenticated employee.

**Query params** — `page`, `limit`.

**Response `200`** — paginated list of Payslip objects.

---

#### GET `/ess/payroll/payslips/:id/download`
Download a payslip as PDF.

**Response `200`** — PDF file stream.

---

## 14. Calendar Events

### GET `/calendar/events`
List calendar events for a month.

**Query params**
| Param | Type | Description |
|---|---|---|
| `year` | number | e.g. `2026` |
| `month` | number | 1-12 |

**Response `200`**
```json
[
  {
    "id": "uuid",
    "title": "Design conference",
    "start": "2026-03-19",
    "end": "2026-03-19",
    "colorIdx": 3
  }
]
```

---

### POST `/calendar/events`
Create a calendar event.

**Request body**
```json
{
  "title": "Design conference",
  "start": "2026-03-19",
  "end": "2026-03-19",
  "colorIdx": 3
}
```

**Response `201`** — created Event object.

---

### PATCH `/calendar/events/:id`
Update a calendar event.

---

### DELETE `/calendar/events/:id`
Delete a calendar event.

**Response `200`**
```json
{ "message": "Event deleted" }
```

---

## 15. Announcements

### GET `/hr-admin/announcements`
List all sent announcements.

**Query params** — `page`, `limit`.

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "subject": "Q1 Performance Reviews",
      "body": "Hi team…",
      "recipient": "all",
      "recipientName": null,
      "sentAt": "2026-03-15T09:00:00Z",
      "sentBy": { "id": "uuid", "name": "Frank Gbadago" }
    }
  ],
  "total": 3
}
```

---

### POST `/hr-admin/announcements`
Send a new announcement.

**Request body**
```json
{
  "subject": "Office Closure – Public Holiday",
  "body": "The office will be closed…",
  "recipient": "all"
}
```

For a targeted announcement to a specific employee:
```json
{
  "subject": "Probation Confirmation",
  "body": "Congratulations!…",
  "recipient": "employee",
  "employeeId": "uuid"
}
```

**Response `201`** — created Announcement object.

---

### DELETE `/hr-admin/announcements/:id`
Delete an announcement.

**Response `200`**
```json
{ "message": "Announcement deleted" }
```

---

## 16. Reports

### HR endpoints

#### GET `/reports`
List all employee-submitted reports.

**Query params**
| Param | Type | Description |
|---|---|---|
| `search` | string | Filter by employee name or title |
| `type` | string | `Performance` \| `Work Summary` \| `Incident` \| `Goal Update` \| `Complaint` |
| `status` | string | `Submitted` \| `Under Review` \| `Resolved` \| `Closed` |
| `department` | string | Department name |
| `page` | number | |
| `limit` | number | |

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "employee": { "id": "uuid", "name": "Tiger Nixon", "photo": "url" },
      "reportType": "Performance",
      "title": "Q1 2026 Performance Review",
      "period": "Q1 2026",
      "submittedOn": "2026-03-31",
      "status": "Under Review",
      "summary": "Exceeded all KPIs…",
      "score": 92
    }
  ],
  "total": 18
}
```

---

#### GET `/reports/:id`
Get full report detail.

---

#### PATCH `/reports/:id/status`
Update a report's review status.

**Request body**
```json
{ "status": "Resolved", "reviewNote": "Acknowledged and filed." }
```

**Response `200`** — updated Report object.

---

### ESS endpoints

#### GET `/ess/reports`
List the authenticated employee's own reports.

**Query params** — `type`, `status`, `page`, `limit`.

---

#### POST `/ess/reports`
Submit a new report.

**Request body**
```json
{
  "type": "Performance",
  "title": "Q1 2026 Performance Review",
  "period": "Q1 2026",
  "summary": "Exceeded all KPIs this quarter…"
}
```

**Response `201`** — created Report object.

---

## 17. Complaints

### HR endpoints

#### GET `/reports/complaints`
List all employee complaints.

**Query params** — `search`, `status`, `page`, `limit`.

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "employee": { "id": "uuid", "name": "Colleen Hurst" },
      "title": "Workplace Harassment Concern",
      "description": "…",
      "submittedOn": "2026-04-01",
      "status": "Under Review"
    }
  ]
}
```

---

#### PATCH `/reports/complaints/:id/status`
Update a complaint's resolution status.

**Request body**
```json
{ "status": "Resolved", "resolution": "Issue addressed with team lead." }
```

---

### ESS endpoints

#### GET `/ess/complaints`
List the authenticated employee's own complaints.

---

#### POST `/ess/complaints`
Submit a new complaint.

**Request body**
```json
{
  "title": "Workplace Harassment Concern",
  "description": "Detailed description of the incident…",
  "anonymous": false
}
```

**Response `201`** — created Complaint object.

---

## 18. Documents

### ESS endpoints

#### GET `/ess/documents`
List all documents for the authenticated employee.

**Query params** — `category` (`Company-issued` \| `Certificate` \| `Personal` \| `Payroll` \| `Uploaded`), `search`.

**Response `200`**
```json
[
  {
    "id": "uuid",
    "name": "Employment Contract.pdf",
    "category": "Company-issued",
    "fileType": "pdf",
    "size": "1.2 MB",
    "issuedBy": "HR Department",
    "issuedOn": "2024-01-15",
    "expiresOn": null,
    "status": "Verified",
    "downloadUrl": "/ess/documents/uuid/download"
  }
]
```

---

#### POST `/ess/documents/upload`
Upload a document for the authenticated employee.

**Request body** (`multipart/form-data`)
```
file: <file>
name: Training Certificate
category: Certificate
```

**Response `201`** — created Document object.

---

#### GET `/ess/documents/:id/download`
Download a document.

**Response `200`** — file stream.

---

#### DELETE `/ess/documents/:id`
Delete an uploaded document (only `Uploaded` category can be deleted).

**Response `200`**
```json
{ "message": "Document deleted" }
```

---

### HR endpoints

#### GET `/employee-management/employees/:id/documents`
List all documents for a specific employee.

---

## 19. Settings — Company

### GET `/settings/company`
Get the current company settings.

**Response `200`**
```json
{
  "name": "Acme Corp",
  "logoUrl": "https://…",
  "website": "https://acme.com",
  "industry": "Technology",
  "size": "51-200",
  "timezone": "UTC+0 — London",
  "currency": "USD — US Dollar",
  "fiscalYearStart": "January",
  "dateFormat": "DD/MM/YYYY",
  "workStart": "09:00",
  "workEnd": "17:00",
  "workingDays": ["Mon","Tue","Wed","Thu","Fri"],
  "officeLocations": []
}
```

---

### PATCH `/settings/company`
Update company settings. All fields optional.

**Request body** — partial Company settings.

**Response `200`** — updated settings object.

---

### POST `/settings/company/logo`
Upload/replace the company logo.

**Request body** (`multipart/form-data`)
```
file: <image>
```

**Response `200`**
```json
{ "logoUrl": "https://cdn.example.com/logo.png" }
```

---

## 20. Settings — Leave Policy

### GET `/settings/leave`
Get current leave policy configuration.

**Response `200`**
```json
{
  "leaveTypes": [
    { "id": "uuid", "name": "Annual Leave", "days": 14, "paid": true }
  ],
  "requireApproval": true,
  "noticePeriodDays": 2,
  "allowCarryover": true,
  "maxCarryoverDays": 5
}
```

---

### PATCH `/settings/leave`
Update leave policy settings.

---

### POST `/settings/leave/types`
Add a new leave type.

**Request body**
```json
{ "name": "Study Leave", "days": 5, "paid": true }
```

**Response `201`** — created LeaveType object.

---

### PATCH `/settings/leave/types/:id`
Update a leave type.

---

### DELETE `/settings/leave/types/:id`
Delete a leave type.

---

## 21. Settings — Payroll Config

### GET `/settings/payroll`
Get payroll configuration.

**Response `200`**
```json
{
  "payFrequency": "Monthly",
  "payDay": 28,
  "currency": "USD",
  "defaultAllowances": [
    { "id": "uuid", "name": "Transport Allowance", "amount": 200 }
  ],
  "taxEnabled": true,
  "socialSecurityRate": 6.2,
  "healthInsuranceRate": 2.5
}
```

---

### PATCH `/settings/payroll`
Update payroll settings.

---

### POST `/settings/payroll/allowances`
Add a default allowance.

**Request body**
```json
{ "name": "Meal Allowance", "amount": 150 }
```

---

### DELETE `/settings/payroll/allowances/:id`
Remove a default allowance.

---

## 22. Settings — Security & Roles

### GET `/settings/security/roles`
List all roles and their permissions.

**Response `200`**
```json
[
  {
    "role": "HR_ADMIN",
    "canEdit": true,
    "canExport": true,
    "canDelete": true
  },
  {
    "role": "HR_MANAGER",
    "canEdit": true,
    "canExport": true,
    "canDelete": false
  },
  {
    "role": "RECRUITER",
    "canEdit": true,
    "canExport": false,
    "canDelete": false
  },
  {
    "role": "EMPLOYEE",
    "canEdit": false,
    "canExport": false,
    "canDelete": false
  }
]
```

---

### PATCH `/settings/security/roles/:role`
Update permissions for a role.

**Request body**
```json
{
  "canEdit": true,
  "canExport": true,
  "canDelete": false
}
```

**Response `200`** — updated role object.

---

### PATCH `/settings/security/password-policy`
Update the password policy.

**Request body**
```json
{
  "minLength": 8,
  "requireUppercase": true,
  "requireNumbers": true,
  "requireSymbols": false,
  "expiryDays": 90
}
```

---

### PATCH `/settings/security/2fa`
Enable or disable 2-factor authentication enforcement.

**Request body**
```json
{ "required": true }
```

---

## 23. Settings — Notifications

### GET `/settings/notifications`
Get notification preferences for the company.

**Response `200`**
```json
{
  "emailOnLeaveRequest": true,
  "emailOnLeaveApproval": true,
  "emailOnNewApplicant": false,
  "emailOnPayrollRun": true,
  "inAppOnAnnouncement": true,
  "inAppOnInterview": true
}
```

---

### PATCH `/settings/notifications`
Update notification preferences.

---

## 24. Notifications (in-app)

### GET `/notifications`
List in-app notifications for the current user.

**Query params** — `isRead` (boolean), `page`, `limit`.

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Leave Approved",
      "message": "Your annual leave for Mar 18-20 has been approved.",
      "isRead": false,
      "createdAt": "2026-04-01T10:00:00Z"
    }
  ],
  "unreadCount": 3,
  "total": 12
}
```

---

### GET `/notifications/unread-count`
Get just the unread count badge number.

**Response `200`**
```json
{ "count": 3 }
```

---

### PATCH `/notifications/:id/read`
Mark a single notification as read.

**Response `200`** — updated Notification object.

---

### PATCH `/notifications/read-all`
Mark all notifications as read.

**Response `200`**
```json
{ "updated": 3 }
```

---

### DELETE `/notifications/:id`
Delete a notification.

**Response `200`**
```json
{ "message": "Notification deleted" }
```

---

## 25. Admin — User Management

### GET `/admin/users`
List all admin/HR users.

**Query params** — `search`, `role`, `status`, `page`, `limit`.

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "email": "frank@company.com",
      "fullName": "Frank Gbadago",
      "role": "HR_ADMIN",
      "status": "Active",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 4
}
```

---

### PATCH `/admin/users/:id`
Update an admin user's role or status.

**Request body**
```json
{ "role": "HR_MANAGER" }
```

or

```json
{ "status": "Suspended" }
```

**Response `200`** — updated User object.

---

### DELETE `/admin/users/:id`
Remove an admin user.

**Response `200`**
```json
{ "message": "User removed" }
```

---

## 26. File Upload

### POST `/upload`
Generic file upload endpoint (images, documents).

**Request body** (`multipart/form-data`)
```
file: <file>
type: "avatar" | "document" | "logo"
```

**Response `200`**
```json
{
  "url": "https://cdn.example.com/uploads/filename.png",
  "key": "uploads/filename.png",
  "size": 204800,
  "mimeType": "image/png"
}
```

---

## Common Error Responses

All endpoints return errors in this shape:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Must be a valid email" }
  ]
}
```

| Status | Meaning |
|--------|---------|
| `400` | Bad request / validation error |
| `401` | Unauthenticated — missing or invalid token |
| `403` | Forbidden — insufficient role/permission |
| `404` | Resource not found |
| `409` | Conflict — duplicate resource |
| `422` | Unprocessable entity |
| `500` | Internal server error |

---

## Role-Based Access Summary

| Endpoint group | `EMPLOYEE` | `RECRUITER` | `HR_MANAGER` | `HR_ADMIN` |
|---|---|---|---|---|
| Auth | ✓ | ✓ | ✓ | ✓ |
| ESS (`/ess/*`) | own data only | — | — | ✓ |
| Recruitment | — | ✓ | ✓ | ✓ |
| Employees | — | read only | ✓ | ✓ |
| Payroll | — | — | read only | ✓ |
| Settings | — | — | read only | ✓ |
| Admin users | — | — | — | ✓ |
