import { Linkedin, Github, Globe, Twitter, Trash2, Plus } from "lucide-react"
import { FieldLabel, TextInput } from "./form-controls"
import type { ExtraLink, Step4Data } from "./constants"

export function Step4({
  data,
  onChange,
}: {
  data: Step4Data
  onChange: (next: Partial<Step4Data>) => void
}) {
  function addExtraLink() {
    onChange({ extraLinks: [...data.extraLinks, { label: "", url: "" }] })
  }
  function removeExtraLink(i: number) {
    onChange({ extraLinks: data.extraLinks.filter((_, idx) => idx !== i) })
  }
  function updateExtraLink(i: number, field: keyof ExtraLink, val: string) {
    onChange({
      extraLinks: data.extraLinks.map((l, idx) =>
        idx === i ? { ...l, [field]: val } : l
      ),
    })
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-muted/50 p-3">
        <p className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
          Professional Networks
        </p>
        <div className="space-y-2.5">
          <div>
            <FieldLabel optional>LinkedIn</FieldLabel>
            <TextInput
              value={data.linkedin}
              onChange={(v) => onChange({ linkedin: v })}
              placeholder="linkedin.com/in/yourprofile"
              prefix={<Linkedin className="size-4" />}
            />
          </div>
          <div>
            <FieldLabel optional>GitHub / GitLab</FieldLabel>
            <TextInput
              value={data.github}
              onChange={(v) => onChange({ github: v })}
              placeholder="github.com/yourusername"
              prefix={<Github className="size-4" />}
            />
          </div>
          <div>
            <FieldLabel optional>Personal Website / Portfolio</FieldLabel>
            <TextInput
              value={data.website}
              onChange={(v) => onChange({ website: v })}
              placeholder="https://yourportfolio.com"
              type="url"
              prefix={<Globe className="size-4" />}
            />
          </div>
          <div>
            <FieldLabel optional>Twitter / X or Other Social</FieldLabel>
            <TextInput
              value={data.twitter}
              onChange={(v) => onChange({ twitter: v })}
              placeholder="twitter.com/yourhandle"
              prefix={<Twitter className="size-4" />}
            />
          </div>
        </div>
      </div>

      {/* Extra links */}
      {data.extraLinks.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
            Additional Links
          </p>
          {data.extraLinks.map((link, i) => (
            <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5">
              <div className="w-full sm:w-[130px] sm:shrink-0">
                <input
                  value={link.label}
                  onChange={(e) => updateExtraLink(i, "label", e.target.value)}
                  placeholder="Label"
                  className="h-[44px] w-full rounded-lg border border-border bg-muted px-2.5 text-[12px] text-foreground outline-none focus:border-primary"
                />
              </div>
              <div className="flex w-full sm:flex-1 gap-1.5">
                <input
                  value={link.url}
                  onChange={(e) => updateExtraLink(i, "url", e.target.value)}
                  placeholder="https://…"
                  className="h-[44px] flex-1 rounded-lg border border-border bg-muted px-2.5 text-[12px] text-foreground outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => removeExtraLink(i)}
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-rose-50 hover:text-rose-500"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={addExtraLink}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-2 text-[12px] font-medium text-primary hover:border-primary hover:bg-primary/5"
      >
        <Plus className="size-3.5" /> Add another link
      </button>
    </div>
  )
}
