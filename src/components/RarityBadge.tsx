import type { Rarity } from "../types";
import { RARITY_CONFIGS } from "../types";

interface Props {
  rarity: Rarity;
  size?: "sm" | "md";
}

export function RarityBadge({ rarity, size = "md" }: Props) {
  const c = RARITY_CONFIGS.find((x) => x.rarity === rarity)!;
  const s = size === "sm" ? { p: "2px 8px", fs: 8 } : { p: "3px 10px", fs: 9 };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 3,
      padding: s.p, borderRadius: "var(--radius-full)",
      fontFamily: "var(--font-display)", fontSize: s.fs,
      letterSpacing: "0.08em", color: c.color,
      background: `${c.color}12`, border: `1px solid ${c.color}33`,
    }}>
      ◆ {c.label}
    </span>
  );
}