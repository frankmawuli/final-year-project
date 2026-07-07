"use client";

import { useState } from "react";

export function WorkExperienceSection() {
  const [noExperience, setNoExperience] = useState(false);

  return (
    <div className="px-5 py-5">
      <h3 className="text-[15px] font-semibold text-foreground">Work Experience</h3>
      <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed">
        Add your Work Experience. Such as an internship, part-time work or long term specialised
        experience.
      </p>
      <label className="mt-3 flex w-fit cursor-pointer items-center gap-1.5 text-[13px] text-foreground">
        <input
          type="checkbox"
          checked={noExperience}
          onChange={(e) => setNoExperience(e.target.checked)}
          className="w-4 h-4 rounded border-[#D1D5DB] text-primary focus:ring-primary"
        />
        I have no experience
      </label>
    </div>
  );
}
