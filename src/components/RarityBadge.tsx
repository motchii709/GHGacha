import type { Rarity } from "../types";
import { RARITY_CONFIGS } from "../types";

interface Props {
  rarity: Rarity;
  size?: "sm" | "md";
}

export function RarityBadge({ rarity, size = "md" }: Props) {
  const c = RARITY_CONFIGS.find((x) => x.rarity === rarity)!;
  const isSm = size === "sm";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: isSm ? "2px 8px" : "4px 14px",
        borderRadius: "var(--radius-full)",
        fontFamily: "var(--font-display)",
        fontSize: isSm ? "9px" : "11px",
        fontWeight: 400,
        letterSpacing: "0.08em",
        color: c.color,
        background: `${c.color}15`,
        border: `1px solid ${c.color}44`,
        boxShadow: `0 0 12px ${c.color}33`,
      }}
    >
      <span style={{ fontSize: isSm ? "6px" : "8px", opacity: 0.7 }}>◆</span>
      {c.label}
    </span>
  );
}