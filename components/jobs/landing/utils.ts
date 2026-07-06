const LOGO_COLORS = ["#22c55e", "#14b8a6", "#f97316", "#3b82f6", "#8b5cf6", "#ec4899"];

export function logoColor(initials: string): string {
  let h = 0;
  for (const c of initials) h = (h * 31 + c.charCodeAt(0)) & 0xffffffff;
  return LOGO_COLORS[Math.abs(h) % LOGO_COLORS.length];
}
