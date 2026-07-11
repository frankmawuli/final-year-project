export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export const locTypeBadge: Record<string, string> = {
  HQ:     "bg-[#ede9fe] text-[#7c3aed]",
  Office: "bg-[#dbeafe] text-[#2563eb]",
  Branch: "bg-[#fef3c7] text-[#d97706]",
  Remote: "bg-[#dcfce7] text-[#16a34a]",
}

export const inputCls =
  "w-full rounded-xl border border-border bg-muted/50 px-3 py-2 text-xs text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 bg-transparent"

export const selectCls =
  "w-full appearance-none rounded-xl border border-border bg-muted/50 px-3 py-2 pr-7 text-xs text-foreground outline-none focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 bg-transparent"
