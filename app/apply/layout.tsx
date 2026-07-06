import type { ReactNode } from "react"

import { ApplicantAuthProvider } from "@/context/applicant-auth-context"

export default function ApplyLayout({ children }: { children: ReactNode }) {
  return <ApplicantAuthProvider>{children}</ApplicantAuthProvider>
}
