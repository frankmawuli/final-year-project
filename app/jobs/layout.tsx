import type { ReactNode } from "react"

import { ApplicantAuthProvider } from "@/context/applicant-auth-context"

export default function JobsLayout({ children }: { children: ReactNode }) {
  return <ApplicantAuthProvider>{children}</ApplicantAuthProvider>
}
