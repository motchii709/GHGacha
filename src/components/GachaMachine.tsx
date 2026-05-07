import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Rarity } from "../types";
import { RARITY_CONFIGS } from "../types";
import { ResultCard } from "./ResultCard";
import { useGacha } from "../hooks/useGacha";
import { useHistory } from "../hooks/useHistory";
import { useFavorites } from "../hooks/useFavorites";

interface Props {
  language: string;
}

const SHUFFLE_ITEMS = ["N", "R", "SR", "UR"] as Rarity[];

export function GachaMachine({ language }: Props) {
  const { pulling, result, error, pull, reset } = useGacha();
  const { addToHistory } = useHistory();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [showingResult, setShowingResult] = useState(false);
  const [shuffleRarity, setShuffleRarity] = useState<Rarity>("N");

  useEffect(() => {
    if (!pulling) return;
    setShowingResult(false);
    const interval = setInterval(() => {
      setShuffleRarity(SHUFFLE_ITEMS[Math.floor(Math.random() * SHUFFLE_ITEMS.length)]);
    }, 150);
    return () => clearInterval(interval);
  }, [pulling]);

  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => {
        setShowingResult(true);
        addToHistory({ repo: result.repo, rarity: result.rarity, timestamp: Date.now() });
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [result, addToHistory]);

  const handlePull = () => {
    reset();
    pull(language);
  };

  const shuffleConfig = RARITY_CONFIGS.find((c) => c.rarity === shuffleRarity)!;

  return (
    <div style={{ textAlign: "center", padding: "24px" }}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handlePull}
        disabled={pulling}
        style={{
          padding: "16px 48px",
          fontSize: "20px",
          fontWeight: 700,
          borderRadius: "50px",
          border: "none",
          background: pulling
            ? "linear-gradient(135deg, #444, #666)"
            : "linear-gradient(135deg, #667eea, #764ba2)",
          color: "#fff",
          cursor: pulling ? "not-allowed" : "pointer",
          boxShadow: pulling ? "none" : "0 4px 20px rgba(102, 126, 234, 0.4)",
          transition: "all 0.3s",
        }}
      >
        {pulling ? "Pulling..." : "🎰 Pull Gacha"}
      </motion.button>

      <AnimatePresence mode="wait">
        {pulling && (
          <motion.div
            key="shuffle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ marginTop: "40px" }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 0.3 }}
              style={{
                width: "200px",
                height: "280px",
                margin: "0 auto",
                borderRadius: "16px",
                background: `linear-gradient(135deg, ${shuffleConfig.color}44, ${shuffleConfig.color}22)`,
                border: `2px solid ${shuffleConfig.color}`,
                boxShadow: `0 0 30px ${shuffleConfig.glowColor}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "48px",
                fontWeight: 700,
                color: shuffleConfig.color,
              }}
            >
              {shuffleConfig.label}
            </motion.div>
          </motion.div>
        )}

        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: "24px", color: "#ef4444", fontSize: "14px" }}
          >
            {error}
          </motion.div>
        )}

        {showingResult && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ResultCard
              repo={result.repo}
              rarity={result.rarity}
              isFavorite={isFavorite(result.repo.id)}
              onToggleFavorite={() => toggleFavorite({ repo: result.repo, rarity: result.rarity, timestamp: Date.now() })}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}