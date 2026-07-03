import Link from "next/link"
import { LogoJobs } from "@/components/logo"
import { SignupForm } from "@/components/signup-form"

export default function SignupPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-muted/40 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/jobs" className="flex items-center gap-2.5 self-center">
          <LogoJobs width={36} height={36} />
          <span className="text-[15px] font-semibold text-foreground">CoreRecruiter Jobs</span>
        </Link>
        <SignupForm />
      </div>
    </div>
  )
}
