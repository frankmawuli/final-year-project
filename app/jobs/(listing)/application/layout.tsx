import type { ReactNode } from "react";
import RequireApplicantAuth from "@/components/require-applicant-auth";

export default function ApplicationLayout({ children }: { children: ReactNode }) {
  return <RequireApplicantAuth>{children}</RequireApplicantAuth>;
}
