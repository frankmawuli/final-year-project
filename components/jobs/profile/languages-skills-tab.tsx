"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormInput, FormLabel, FormSelect } from "@/components/jobs/profile/form-controls";

const PROFICIENCY_LEVELS = ["Basic", "Conversational", "Fluent", "Native / Bilingual"];

interface LanguageEntry {
  id: string;
  name: string;
  proficiency: string;
}

export function LanguagesSkillsTab() {
  const [languages, setLanguages] = useState<LanguageEntry[]>([]);
  const [addingLanguage, setAddingLanguage] = useState(false);
  const [languageName, setLanguageName] = useState("");
  const [proficiency, setProficiency] = useState(PROFICIENCY_LEVELS[0]);

  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

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

  function handleAddSkill() {
    const trimmed = skillInput.trim();
    if (!trimmed || skills.includes(trimmed)) {
      setSkillInput("");
      return;
    }
    setSkills((prev) => [...prev, trimmed]);
    setSkillInput("");
  }

  function handleRemoveSkill(skill: string) {
    setSkills((prev) => prev.filter((item) => item !== skill));
  }

  return (
    <div className="bg-white rounded-b-xl border border-[#E5E7EB] divide-y divide-[#F3F4F6]">
      <div className="px-6 py-6">
        <h3 className="text-[15px] font-semibold text-foreground">Languages & Skills</h3>
        <p className="mt-1.5 text-[13px] text-muted-foreground leading-relaxed">
          Showcase the languages you speak and the skills that set you apart.
        </p>
      </div>

      <div className="px-6 py-6">
        <h3 className="text-[15px] font-semibold text-foreground">Languages</h3>
        <p className="mt-1.5 text-[13px] text-muted-foreground leading-relaxed">
          Add the languages you speak and your proficiency level.
        </p>

        {languages.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {languages.map((lang) => (
              <span
                key={lang.id}
                className="flex items-center gap-2 rounded-full border border-[#E5E7EB] py-1.5 pl-3.5 pr-2 text-[13px] text-foreground"
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
          <div className="mt-4 flex flex-col gap-3 rounded-xl border border-[#E5E7EB] p-4 sm:flex-row sm:items-end">
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
            <div className="flex gap-2">
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
          <div className="mt-4 flex justify-center">
            <Button size="sm" className="rounded-full px-4" onClick={() => setAddingLanguage(true)}>
              <Plus className="size-3.5" />
              Add
            </Button>
          </div>
        )}
      </div>

      <div className="px-6 py-6">
        <h3 className="text-[15px] font-semibold text-foreground">Skills</h3>
        <p className="mt-1.5 text-[13px] text-muted-foreground leading-relaxed">
          Add skills that showcase your expertise to employers.
        </p>

        {skills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="flex items-center gap-2 rounded-full bg-primary/10 py-1.5 pl-3.5 pr-2 text-[13px] font-medium text-primary"
              >
                {skill}
                <button
                  type="button"
                  aria-label={`Remove ${skill}`}
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-primary/70 hover:text-primary"
                >
                  <X className="size-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex gap-2">
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
          <Button onClick={handleAddSkill}>Add</Button>
        </div>
      </div>
    </div>
  );
}
