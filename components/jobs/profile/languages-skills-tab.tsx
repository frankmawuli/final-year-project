"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormInput, FormLabel, FormSelect } from "@/components/jobs/profile/form-controls";
import { useApplicantAuth } from "@/context/applicant-auth-context";

const PROFICIENCY_LEVELS = ["Basic", "Conversational", "Fluent", "Native / Bilingual"];

interface LanguageEntry {
  id: string;
  name: string;
  proficiency: string;
}

export function LanguagesSkillsTab() {
  const { profile, updateProfile } = useApplicantAuth();

  // Languages have no backend field yet — kept local until the API supports them.
  const [languages, setLanguages] = useState<LanguageEntry[]>([]);
  const [addingLanguage, setAddingLanguage] = useState(false);
  const [languageName, setLanguageName] = useState("");
  const [proficiency, setProficiency] = useState(PROFICIENCY_LEVELS[0]);

  const skills = profile?.skills ?? [];
  const [skillInput, setSkillInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleAddLanguage() {
    const trimmed = languageName.trim();
    if (!trimmed) return;
    setLanguages((prev) => [...prev, { id: crypto.randomUUID(), name: trimmed, proficiency }]);
    setLanguageName("");
    setProficiency(PROFICIENCY_LEVELS[0]);
    setAddingLanguage(false);
  }

  function handleRemoveLanguage(id: string) {
    setLanguages((prev) => prev.filter((lang) => lang.id !== id));
  }

  async function saveSkills(names: string[]) {
    setError(null);
    setSaving(true);
    try {
      await updateProfile({ skills: names });
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save. Please try again.");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function handleAddSkill() {
    const trimmed = skillInput.trim();
    if (!trimmed || skills.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      setSkillInput("");
      return;
    }
    const ok = await saveSkills([...skills.map((s) => s.name), trimmed]);
    if (ok) setSkillInput("");
  }

  function handleRemoveSkill(id: string) {
    saveSkills(skills.filter((s) => s.id !== id).map((s) => s.name));
  }

  return (
    <div className="bg-card rounded-b-xl border border-border divide-y divide-border">
      <div className="px-5 py-5">
        <h3 className="text-[15px] font-semibold text-foreground">Languages & Skills</h3>
        <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed">
          Showcase the languages you speak and the skills that set you apart.
        </p>
      </div>

      <div className="px-5 py-5">
        <h3 className="text-[15px] font-semibold text-foreground">Languages</h3>
        <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed">
          Add the languages you speak and your proficiency level.
        </p>

        {languages.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {languages.map((lang) => (
              <span
                key={lang.id}
                className="flex items-center gap-1.5 rounded-full border border-border py-1 pl-3 pr-1.5 text-[13px] text-foreground"
              >
                <span className="font-medium">{lang.name}</span>
                <span className="text-muted-foreground">· {lang.proficiency}</span>
                <button
                  type="button"
                  aria-label={`Remove ${lang.name}`}
                  onClick={() => handleRemoveLanguage(lang.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="size-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        {addingLanguage ? (
          <div className="mt-3 flex flex-col gap-2.5 rounded-xl border border-border p-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <FormLabel>Language</FormLabel>
              <FormInput
                placeholder="e.g. French"
                value={languageName}
                onChange={(e) => setLanguageName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="flex-1">
              <FormLabel>Proficiency</FormLabel>
              <FormSelect value={proficiency} onChange={(e) => setProficiency(e.target.value)}>
                {PROFICIENCY_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </FormSelect>
            </div>
            <div className="flex gap-1.5">
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary/5"
                onClick={() => {
                  setAddingLanguage(false);
                  setLanguageName("");
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddLanguage}>Save</Button>
            </div>
          </div>
        ) : (
          <div className="mt-3 flex justify-center">
            <Button size="sm" className="rounded-full px-3" onClick={() => setAddingLanguage(true)}>
              <Plus className="size-3.5" />
              Add
            </Button>
          </div>
        )}
      </div>

      <div className="px-5 py-5">
        <h3 className="text-[15px] font-semibold text-foreground">Skills</h3>
        <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed">
          Add skills that showcase your expertise to employers.
        </p>

        {skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className="flex items-center gap-1.5 rounded-full bg-primary/10 py-1 pl-3 pr-1.5 text-[13px] font-medium text-primary"
              >
                {skill.name}
                <button
                  type="button"
                  aria-label={`Remove ${skill.name}`}
                  onClick={() => handleRemoveSkill(skill.id)}
                  disabled={saving}
                  className="text-primary/70 hover:text-primary disabled:opacity-50"
                >
                  <X className="size-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="mt-3 flex gap-1.5">
          <FormInput
            placeholder="e.g. React, Project Management"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddSkill();
              }
            }}
          />
          <Button onClick={handleAddSkill} disabled={saving}>
            {saving ? "Saving…" : "Add"}
          </Button>
        </div>
        {error && <p className="mt-1.5 text-[13px] text-destructive">{error}</p>}
      </div>
    </div>
  );
}
