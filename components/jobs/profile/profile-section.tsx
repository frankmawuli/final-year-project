import type { ReactNode } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProfileSection({
  title,
  description,
  actionLabel,
  onAction,
  children,
}: {
  title: string;
  description: string;
  actionLabel: string;
  onAction?: () => void;
  children?: ReactNode;
}) {
  return (
    <div className="px-5 py-5">
      <h3 className="text-[15px] font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed">{description}</p>
      {children}
      <div className="mt-3 flex justify-center">
        <Button variant="outline" size="sm" className="rounded-full px-3" onClick={onAction}>
          <Pencil className="size-3.5" />
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}
