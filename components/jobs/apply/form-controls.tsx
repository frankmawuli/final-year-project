"use client"

import { useState } from "react"
import { ChevronDown, X as XIcon, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

export function FieldLabel({
  children,
  required,
  optional,
}: {
  children: React.ReactNode
  required?: boolean
  optional?: boolean
}) {
  return (
    <label className="mb-1 block text-[13px] font-medium text-foreground">
      {children}
      {required && <span className="ml-0.5 text-rose-500">*</span>}
      {optional && (
        <span className="ml-1 text-[11px] font-normal text-muted-foreground">(optional)</span>
      )}
    </label>
  )
}

export function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  prefix,
  error,
  disabled,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  type?: string
  prefix?: React.ReactNode
  error?: string
  disabled?: boolean
}) {
  return (
    <div>
      <div
        className={cn(
          "flex h-[44px] items-center overflow-hidden rounded-lg border bg-muted",
          disabled && "opacity-60",
          error
            ? "border-rose-400"
            : "border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
        )}
      >
        {prefix && (
          <div className="flex shrink-0 items-center border-r border-border px-2.5 text-muted-foreground">
            {prefix}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="h-full flex-1 bg-transparent px-3 text-[13px] text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
        />
      </div>
      {error && <p className="mt-1 text-[11px] text-rose-500">{error}</p>}
    </div>
  )
}

export function SelectInput({
  value,
  onChange,
  placeholder,
  options,
  error,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  options: string[]
  error?: string
}) {
  return (
    <div>
      <div
        className={cn(
          "relative flex h-[44px] items-center overflow-hidden rounded-lg border bg-muted",
          error
            ? "border-rose-400"
            : "border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
        )}
      >
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-full w-full appearance-none bg-transparent px-3 text-[13px] text-foreground outline-none"
          style={{ color: value ? "var(--foreground)" : "var(--muted-foreground)" }}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 size-4 text-muted-foreground" />
      </div>
      {error && <p className="mt-1 text-[11px] text-rose-500">{error}</p>}
    </div>
  )
}

export function TagInput({
  items,
  onRemove,
  placeholder,
  onAdd,
}: {
  items: string[]
  onRemove: (i: number) => void
  placeholder: string
  onAdd: (v: string) => void
}) {
  const [input, setInput] = useState("")
  function add() {
    const v = input.trim()
    if (v && !items.includes(v)) {
      onAdd(v)
      setInput("")
    }
  }
  return (
    <div className="min-h-[80px] rounded-lg border border-border bg-muted p-2.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
      <div className="mb-1.5 flex flex-wrap gap-1">
        {items.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[12px] font-medium text-primary"
          >
            {item}
            <button type="button" onClick={() => onRemove(i)}>
              <XIcon className="size-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-1.5">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
        />
        <button
          type="button"
          onClick={add}
          className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
        >
          <Plus className="size-3.5" />
        </button>
      </div>
    </div>
  )
}
