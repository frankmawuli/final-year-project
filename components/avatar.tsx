import { cn } from "@/lib/utils"

export function Avatar({
  src, alt, className,
}: { src?: string | null; alt: string; className?: string }) {
  if (src) {
    return <img src={src} alt={alt} className={cn("rounded-full object-cover", className)} />
  }
  return (
    <div
      role="img"
      aria-label={alt}
      className={cn("relative shrink-0 overflow-hidden rounded-full bg-[#e4ecfd]", className)}
    >
      <span className="absolute left-1/2 top-[22%] size-[38%] -translate-x-1/2 rounded-full bg-[#4d8af0]" />
      <span className="absolute bottom-[-14%] left-1/2 size-[75%] -translate-x-1/2 rounded-t-full bg-[#4d8af0]" />
    </div>
  )
}
