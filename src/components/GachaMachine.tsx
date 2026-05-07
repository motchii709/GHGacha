import { useState, useEffect, useRef } from "react";
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

const CAPSULE_POSITIONS = [
  { x: 30, y: 20, color: "#8a8a9a" },
  { x: 80, y: 10, color: "#4d9eff" },
  { x: 130, y: 25, color: "#b44dff" },
  { x: 50, y: 55, color: "#8a8a9a" },
  { x: 110, y: 50, color: "#4d9eff" },
  { x: 75, y: 85, color: "#ffd700" },
  { x: 30, y: 90, color: "#8a8a9a" },
  { x: 140, y: 80, color: "#b44dff" },
  { x: 55, y: 120, color: "#8a8a9a" },
  { x: 120, y: 115, color: "#4d9eff" },
];

const SHUFFLE_RARITIES: Rarity[] = ["N", "R", "SR", "UR"];

export function GachaMachine({ language }: Props) {
  const { pulling, result, error, pull, reset } = useGacha();
  const { addToHistory } = useHistory();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [phase, setPhase] = useState<"idle" | "shaking" | "dropping" | "reveal">("idle");
  const [shuffleRarity, setShuffleRarity] = useState<Rarity>("N");
  const [flashColor, setFlashColor] = useState<string>("transparent");
  const machineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pulling) return;
    setPhase("shaking");
    const interval = setInterval(() => {
      setShuffleRarity(SHUFFLE_RARITIES[Math.floor(Math.random() * SHUFFLE_RARITIES.length)]);
    }, 120);
    return () => clearInterval(interval);
  }, [pulling]);

  useEffect(() => {
    if (!result) return;
    const c = RARITY_CONFIGS.find((x) => x.rarity === result.rarity)!;
    setPhase("dropping");
    const t1 = setTimeout(() => {
      setPhase("reveal");
      setFlashColor(c.color);
      addToHistory({ repo: result.repo, rarity: result.rarity, timestamp: Date.now() });
    }, 600);
    const t2 = setTimeout(() => setFlashColor("transparent"), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [result, addToHistory]);

  const handlePull = () => {
    if (pulling) return;
    setPhase("idle");
    reset();
    pull(language);
  };

  const rarityCfg = RARITY_CONFIGS.find((x) => x.rarity === shuffleRarity)!;
  const resultCfg = result ? RARITY_CONFIGS.find((x) => x.rarity === result.rarity)! : null;

  return (
    <div className="machine-container">
      {flashColor !== "transparent" && (
        <div
          className="screen-flash"
          style={{ background: `radial-gradient(circle at center, ${flashColor}33, transparent 70%)` }}
        />
      )}

      <motion.div
        ref={machineRef}
        className="machine-body"
        animate={phase === "shaking" ? { x: [0, -3, 3, -3, 3, -2, 2, -1, 1, 0] } : {}}
        transition={phase === "shaking" ? { duration: 0.5, ease: "easeInOut" } : {}}
      >
        <div className="machine-led">
          {[rarityCfg.color, "#8a8a9a", rarityCfg.color, "#8a8a9a", rarityCfg.color].map((c, i) => (
            <div key={i} className="machine-led-dot" style={{ background: c, boxShadow: `0 0 6px ${c}` }} />
          ))}
        </div>

        <div className="machine-dome">
          <div className="machine-dome-shine" />
          {CAPSULE_POSITIONS.map((cap, i) => (
            <div
              key={i}
              className="capsule"
              style={{
                left: `${cap.x}px`,
                top: `${cap.y}px`,
                background: `linear-gradient(180deg, ${cap.color}, ${cap.color}88)`,
                boxShadow: `0 0 8px ${cap.color}44`,
              }}
            />
          ))}
        </div>

        <div className="machine-screen">
          {phase === "idle" && (
            <span style={{ opacity: 0.6 }}>INSERT COIN</span>
          )}
          {phase === "shaking" && (
            <motion.span
              key={shuffleRarity}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{ color: rarityCfg.color, fontFamily: "var(--font-display)", fontSize: "14px", letterSpacing: "0.1em" }}
            >
              {rarityCfg.label}
            </motion.span>
          )}
          {phase === "dropping" && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ color: resultCfg?.color, fontSize: "11px" }}
            >
              {resultCfg?.labelJp.toUpperCase()} DROP!
            </motion.span>
          )}
          {phase === "reveal" && (
            <span style={{ color: resultCfg?.color, fontSize: "11px" }}>
              {resultCfg?.labelJp} GET!!
            </span>
          )}
        </div>

        <div className="machine-lever-area">
          <motion.button
            className="pull-button"
            onClick={handlePull}
            disabled={pulling}
            whileHover={!pulling ? { scale: 1.05 } : {}}
            whileTap={!pulling ? { scale: 0.9 } : {}}
          >
            {pulling ? "⏳" : "🎯"}
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {phase === "dropping" && result && (
          <motion.div
            key="capsule-fall"
            initial={{ y: -60, opacity: 0, scale: 0.6 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
            style={{
              width: "60px",
              height: "70px",
              margin: "16px auto 0",
              borderRadius: "30px 30px 20px 20px",
              background: `linear-gradient(180deg, ${resultCfg?.color}, ${resultCfg?.color}88)`,
              boxShadow: `0 0 30px ${resultCfg?.color}66`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-display)",
              fontSize: "10px",
              color: "#fff",
              letterSpacing: "0.05em",
            }}
          >
            {resultCfg?.label}
          </motion.div>
        )}

        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: "16px",
              padding: "12px 20px",
              borderRadius: "var(--radius-md)",
              background: "#2a0a0a",
              border: "1px solid #ff2d7844",
              color: "#ff6b8a",
              fontSize: "13px",
              textAlign: "center",
            }}
          >
            {error}
          </motion.div>
        )}

        {phase === "reveal" && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 150, damping: 15, delay: 0.15 }}
            style={{ width: "100%", marginTop: "24px" }}
          >
            <ResultCard
              repo={result.repo}
              rarity={result.rarity}
              isFavorite={isFavorite(result.repo.id)}
              onToggleFavorite={() =>
                toggleFavorite({ repo: result.repo, rarity: result.rarity, timestamp: Date.now() })
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}