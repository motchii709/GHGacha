import { useState, useCallback } from "react";
import type { GitHubRepo, Rarity } from "../types";
import { RARITY_CONFIGS } from "../types";
import { searchRepo } from "../services/api";

function drawRarity(): Rarity {
  const roll = Math.random();
  let cumulative = 0;
  for (const config of RARITY_CONFIGS) {
    cumulative += config.probability;
    if (roll < cumulative) return config.rarity;
  }
  return "N";
}

interface UseGachaReturn {
  pulling: boolean;
  result: { repo: GitHubRepo; rarity: Rarity } | null;
  error: string | null;
  pull: (language: string) => Promise<void>;
  reset: () => void;
}

export function useGacha(): UseGachaReturn {
  const [pulling, setPulling] = useState(false);
  const [result, setResult] = useState<{ repo: GitHubRepo; rarity: Rarity } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pull = useCallback(async (language: string) => {
    setPulling(true);
    setError(null);
    setResult(null);
    try {
      const rarity = drawRarity();
      const data = await searchRepo(language, rarity);
      setResult(data);
    } catch (e: any) {
      setError(e.message || "Failed to pull gacha");
    } finally {
      setPulling(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { pulling, result, error, pull, reset };
}