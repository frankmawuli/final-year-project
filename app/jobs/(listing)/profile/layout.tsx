import type { ReactNode } from "react";
import RequireApplicantAuth from "@/components/require-applicant-auth";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return <RequireApplicantAuth>{children}</RequireApplicantAuth>;
}
