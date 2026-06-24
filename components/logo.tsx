import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function Logo({ className, width = 46, height = 46 }: LogoProps) {
  return (
    <Image
      src="/assets/logo1.png"
      alt="CoreRecruiter"
      width={width}
      height={height}
      className={cn("object-contain", className)}
      priority
    />
  );
}

export function LogoJobs({ className, width = 46, height = 46 }: LogoProps) {
  return (
    <Image
      src="/assets/logo1.png"
      alt="CoreRecruiter Jobs"
      width={width}
      height={height}
      className={cn("object-contain", className)}
      priority
    />
  );
}
