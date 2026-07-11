"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn(className)} {...props}>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Create an account</CardTitle>
          <CardDescription>Join CoreRecruiter to find your next opportunity</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <form className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" type="text" placeholder="John Doe" required />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" required />
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="flex flex-col gap-1">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="confirm-password">Confirm</Label>
                <Input id="confirm-password" type="password" required />
              </div>
            </div>
            <p className="text-xs text-muted-foreground -mt-1">Must be at least 8 characters.</p>
            <Button type="submit" className="w-full mt-1">Create Account</Button>
          </form>

          <div className="flex items-center gap-2.5">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">or</span>
            <Separator className="flex-1" />
          </div>

          <Button variant="outline" type="button" className="w-full">
            Continue with Google
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-foreground font-medium underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>

          <p className="text-center text-xs text-muted-foreground">
            By creating an account you agree to our{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary">Privacy Policy</a>.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
