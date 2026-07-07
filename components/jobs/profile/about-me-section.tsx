"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

const MAX_LENGTH = 2000;
const DESCRIPTION =
  "Keeping this section up to date will help employers & recruiters find you. They will know the field you are in, what your preferred industries are, and if you are actively looking. Give a short overview of your career history and skills.";

export function AboutMeSection({
  value = "",
  onSave,
}: {
  value?: string;
  onSave?: (about: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleEdit() {
    setDraft(value);
    setError(null);
    setEditing(true);
  }

  function handleCancel() {
    setEditing(false);
  }

  async function handleSave() {
    setError(null);
    if (!onSave) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      await onSave(draft);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (editing) {
    return (
      <div>
        <div className="px-5 py-5">
          <h3 className="text-[15px] font-semibold text-foreground">About Me</h3>
          <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed">
            Give a short overview of your career history and skills.
          </p>
        </div>
        <div className="border-t border-[#F3F4F6] px-5 py-5">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value.slice(0, MAX_LENGTH))}
            placeholder="Max. 2000 characters"
            rows={8}
            className="w-full resize-none rounded-xl border border-[#E5E7EB] p-3 text-[13.5px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {error && <p className="mt-1.5 text-[13px] text-destructive">{error}</p>}
        </div>
        <div className="flex justify-end gap-2.5 border-t border-[#F3F4F6] px-5 py-3">
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary/5"
            onClick={handleCancel}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 py-5">
      <h3 className="text-[15px] font-semibold text-foreground">About Me</h3>
      <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed">
        {value || DESCRIPTION}
      </p>
      <div className="mt-3 flex justify-center">
        <Button variant="outline" size="sm" className="rounded-full px-3" onClick={handleEdit}>
          <Pencil className="size-3.5" />
          {value ? "Edit" : "Add"}
        </Button>
      </div>
    </div>
  );
}
