import { cn } from "@/lib/utils";

type Props = {
  label: string;
  count: number;
  checked: boolean;
  onChange: (v: boolean) => void;
};

export function FilterCheckbox({ label, count, checked, onChange }: Props) {
  return (
    <label
      className="flex items-center justify-between cursor-pointer group py-[5px]"
      onClick={() => onChange(!checked)}
    >
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "w-[15px] h-[15px] rounded-[3px] border flex items-center justify-center shrink-0 transition-colors",
            checked
              ? "bg-primary border-primary"
              : "border-[#C9CDD3] bg-white group-hover:border-primary/60"
          )}
        >
          {checked && (
            <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 6L5 9L10 3"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        <span
          className={cn(
            "text-[12.5px] leading-none select-none",
            checked ? "text-foreground font-medium" : "text-muted-foreground"
          )}
        >
          {label}
        </span>
      </div>
      <span
        className={cn(
          "text-[10px] font-semibold px-[6px] py-[2px] rounded-[4px] leading-none",
          checked ? "bg-primary text-white" : "bg-[#F0F1F3] text-muted-foreground"
        )}
      >
        {count}
      </span>
    </label>
  );
}
