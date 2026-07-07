import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FilterCheckbox } from "./filter-checkbox";
import { DualRangeSlider } from "./dual-range-slider";
import type { FilterItem } from "@/app/jobs/(listing)/job-listing/data";

type Props = {
  employmentFilters: FilterItem[];
  onEmploymentChange: (idx: number, checked: boolean) => void;
  seniorityFilters: FilterItem[];
  onSeniorityChange: (idx: number, checked: boolean) => void;
  minSalary: number;
  maxSalary: number;
  onMinSalaryChange: (v: number) => void;
  onMaxSalaryChange: (v: number) => void;
  onReset: () => void;
};

export function JobSidebar({
  employmentFilters,
  onEmploymentChange,
  seniorityFilters,
  onSeniorityChange,
  minSalary,
  maxSalary,
  onMinSalaryChange,
  onMaxSalaryChange,
  onReset,
}: Props) {
  const [employmentOpen, setEmploymentOpen] = useState(true);
  const [seniorityOpen, setSeniorityOpen] = useState(true);
  const [salaryOpen, setSalaryOpen] = useState(true);

  return (
    <aside className="w-full">
      {/* Type of Employment */}
      <div className="mb-1">
        <button
          className="flex items-center justify-between w-full py-1.5 mb-1"
          onClick={() => setEmploymentOpen((o) => !o)}
        >
          <span className="text-[13px] font-bold text-foreground">Type of Employment</span>
          {employmentOpen ? (
            <ChevronUp className="w-[15px] h-[15px] text-[#9CA3AF]" />
          ) : (
            <ChevronDown className="w-[15px] h-[15px] text-[#9CA3AF]" />
          )}
        </button>
        {employmentOpen && (
          <div className="flex flex-col">
            {employmentFilters.map((f, idx) => (
              <FilterCheckbox
                key={f.label}
                label={f.label}
                count={f.count}
                checked={f.checked}
                onChange={(v) => onEmploymentChange(idx, v)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="h-px bg-[#F3F4F6] my-3" />

      {/* Seniority Level */}
      <div className="mb-1">
        <button
          className="flex items-center justify-between w-full py-1.5 mb-1"
          onClick={() => setSeniorityOpen((o) => !o)}
        >
          <span className="text-[13px] font-bold text-foreground">Seniority Level</span>
          {seniorityOpen ? (
            <ChevronUp className="w-[15px] h-[15px] text-[#9CA3AF]" />
          ) : (
            <ChevronDown className="w-[15px] h-[15px] text-[#9CA3AF]" />
          )}
        </button>
        {seniorityOpen && (
          <div className="flex flex-col">
            {seniorityFilters.map((f, idx) => (
              <FilterCheckbox
                key={f.label}
                label={f.label}
                count={f.count}
                checked={f.checked}
                onChange={(v) => onSeniorityChange(idx, v)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="h-px bg-[#F3F4F6] my-3" />

      {/* Salary Range */}
      <div className="mb-5">
        <button
          className="flex items-center justify-between w-full py-1.5 mb-2.5"
          onClick={() => setSalaryOpen((o) => !o)}
        >
          <span className="text-[13px] font-bold text-foreground">Salary Range</span>
          {salaryOpen ? (
            <ChevronUp className="w-[15px] h-[15px] text-[#9CA3AF]" />
          ) : (
            <ChevronDown className="w-[15px] h-[15px] text-[#9CA3AF]" />
          )}
        </button>
        {salaryOpen && (
          <div>
            <DualRangeSlider
              min={0}
              max={500000}
              minVal={minSalary}
              maxVal={maxSalary}
              onMinChange={onMinSalaryChange}
              onMaxChange={onMaxSalaryChange}
            />
            <div className="flex items-center gap-1.5 mt-2.5">
              <div className="flex-1">
                <p className="text-[9.5px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1">
                  Min
                </p>
                <input
                  type="number"
                  value={minSalary}
                  onChange={(e) => onMinSalaryChange(Number(e.target.value))}
                  className="w-full border border-[#E5E7EB] rounded-lg px-1.5 py-1 text-[11px] text-foreground bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 text-center"
                />
              </div>
              <div className="flex-1">
                <p className="text-[9.5px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1">
                  Max
                </p>
                <input
                  type="number"
                  value={maxSalary}
                  onChange={(e) => onMaxSalaryChange(Number(e.target.value))}
                  className="w-full border border-[#E5E7EB] rounded-lg px-1.5 py-1 text-[11px] text-foreground bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 text-center"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Apply + Reset */}
      <div className="flex gap-1.5">
        <button className="flex-1 bg-primary hover:bg-primary/90 text-white text-[12px] font-bold uppercase tracking-[0.04em] py-2 rounded-lg transition-colors">
          Apply
        </button>
        <button
          onClick={onReset}
          className="flex-1 border border-[#E5E7EB] hover:bg-[#F9FAFB] text-foreground text-[12px] font-semibold py-2 rounded-lg transition-colors"
        >
          Reset
        </button>
      </div>
    </aside>
  );
}
