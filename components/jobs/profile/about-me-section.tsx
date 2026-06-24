"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

const MAX_LENGTH = 2000;
const DESCRIPTION =
  "Keeping this section up to date will help employers & recruiters find you. They will know the field you are in, what your preferred industries are, and if you are actively looking. Give a short overview of your career history and skills.";

export function AboutMeSection() {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState("");
  const [draft, setDraft] = useState("");

  function handleEdit() {
    setDraft(saved);
    setEditing(true);
  }

  function handleCancel() {
    setEditing(false);
  }

  function handleSave() {
    setSaved(draft);
    setEditing(false);
  }

  if (editing) {
    return (
      <div>
        <div className="px-6 py-6">
          <h3 className="text-[15px] font-semibold text-foreground">About Me</h3>
          <p className="mt-1.5 text-[13px] text-muted-foreground leading-relaxed">
            Give a short overview of your career history and skills.
          </p>
        </div>
        <div className="border-t border-[#F3F4F6] px-6 py-6">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value.slice(0, MAX_LENGTH))}
            placeholder="Max. 2000 characters"
            rows={8}
            className="w-full resize-none rounded-xl border border-[#E5E7EB] p-4 text-[13.5px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex justify-end gap-3 border-t border-[#F3F4F6] px-6 py-4">
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary/5"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-6">
      <h3 className="text-[15px] font-semibold text-foreground">About Me</h3>
      <p className="mt-1.5 text-[13px] text-muted-foreground leading-relaxed">
        {saved || DESCRIPTION}
      </p>
      <div className="mt-4 flex justify-center">
        <Button variant="outline" size="sm" className="rounded-full px-4" onClick={handleEdit}>
          <Pencil className="size-3.5" />
          {saved ? "Edit" : "Add"}
        </Button>
      </div>
    </div>
  );
}
