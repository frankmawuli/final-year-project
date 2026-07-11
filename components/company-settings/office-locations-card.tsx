import { ChevronDown, MapPin, Trash2, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "./settings-primitives"
import { inputCls, selectCls, locTypeBadge } from "./constants"
import type { OfficeLocation } from "./types"

export function OfficeLocationsCard({
  locations,
  newLocName,
  newLocType,
  onNewLocNameChange,
  onNewLocTypeChange,
  onAddLocation,
  onRemoveLocation,
}: {
  locations: OfficeLocation[]
  newLocName: string
  newLocType: string
  onNewLocNameChange: (v: string) => void
  onNewLocTypeChange: (v: string) => void
  onAddLocation: () => void
  onRemoveLocation: (id: string) => void
}) {
  return (
    <Card title="Office Locations" subtitle="Physical and remote locations your company operates from" icon={MapPin}>
      <div className="flex flex-col gap-2.5">
        {/* List */}
        {locations.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            {locations.map(loc => (
              <div
                key={loc.id}
                className="flex items-center gap-2.5 rounded-xl border border-border bg-muted/50 px-3 py-2.5"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background shadow-sm">
                  <MapPin className="size-3.5 text-muted-foreground" />
                </div>
                <span className="flex-1 text-xs font-medium text-foreground">{loc.name}</span>
                <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", locTypeBadge[loc.type] ?? "bg-muted text-muted-foreground")}>
                  {loc.type}
                </span>
                <button
                  onClick={() => onRemoveLocation(loc.id)}
                  className="ml-1 rounded-lg p-1 text-muted-foreground transition hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-900/20 dark:hover:text-rose-400"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center rounded-xl border border-dashed border-border py-6 text-center">
            <MapPin className="mb-1.5 size-6 text-muted-foreground/40" />
            <p className="text-xs text-muted-foreground">No locations added yet</p>
          </div>
        )}

        {/* Add row */}
        <div className="flex items-center gap-1.5 pt-1">
          <input
            value={newLocName}
            onChange={e => onNewLocNameChange(e.target.value)}
            placeholder="City, Country"
            className={cn(inputCls, "flex-1")}
            onKeyDown={e => { if (e.key === "Enter") onAddLocation() }}
          />
          <div className="relative shrink-0">
            <select
              value={newLocType}
              onChange={e => onNewLocTypeChange(e.target.value)}
              className={cn(selectCls, "w-28 pr-6")}
            >
              {["HQ","Office","Branch","Remote"].map(t => <option key={t}>{t}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          </div>
          <button
            onClick={onAddLocation}
            className="flex shrink-0 items-center gap-1 rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground shadow-sm hover:bg-muted/50"
          >
            <Plus className="size-3.5" />
            Add
          </button>
        </div>
      </div>
    </Card>
  )
}
