import type { Rarity } from "../types";
import { RARITY_CONFIGS } from "../types";

interface Props {
  rarity: Rarity;
}

export function RarityBadge({ rarity }: Props) {
  const config = RARITY_CONFIGS.find((c) => c.rarity === rarity)!;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 12px",
        borderRadius: "12px",
        fontWeight: 700,
        fontSize: "14px",
        color: "#fff",
        backgroundColor: config.color,
        boxShadow: `0 0 12px ${config.glowColor}`,
      }}
    >
      {config.label}
    </span>
  );
}