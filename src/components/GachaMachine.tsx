import { useState, useEffect, useCallback } from "react";
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

const FAN_COUNT = 5;
const FAN_ANGLES = [-30, -15, 0, 15, 30];
const FAN_X_OFFSETS = [-80, -40, 0, 40, 80];
const FAN_Y_OFFSETS = [20, 8, 0, 8, 20];
const SHUFFLE_RARITIES: Rarity[] = ["N", "R", "SR", "UR"];

const FILLER_LABELS = ["GHGacha", "FORK ME", "STAR★", "COMMIT", "PUSH"];

export function GachaMachine({ language }: Props) {
  const { pulling, result, error, pull, reset } = useGacha();
  const { addToHistory } = useHistory();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [phase, setPhase] = useState<"idle" | "ripping" | "fan" | "revealing" | "done">("idle");
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [shuffleRarity, setShuffleRarity] = useState<Rarity>("N");
  const [flashColor, setFlashColor] = useState<string>("transparent");

  const rarityCfg = RARITY_CONFIGS.find((x) => x.rarity === shuffleRarity)!;

  useEffect(() => {
    if (!pulling) return;
    setPhase("ripping");
    const interval = setInterval(() => {
      setShuffleRarity(SHUFFLE_RARITIES[Math.floor(Math.random() * SHUFFLE_RARITIES.length)]);
    }, 100);
    return () => clearInterval(interval);
  }, [pulling]);

  useEffect(() => {
    if (phase !== "ripping" || pulling) return;
    setTimeout(() => setPhase("fan"), 600);
  }, [phase, pulling]);

  useEffect(() => {
    if (phase !== "fan" || !result) return;
    setTimeout(() => {
      setPhase("revealing");
      let i = 0;
      const iv = setInterval(() => {
        setFlippedIndices((prev) => [...prev, i]);
        i++;
        if (i >= FAN_COUNT) {
          clearInterval(iv);
          const c = RARITY_CONFIGS.find((x) => x.rarity === result.rarity)!;
          setFlashColor(c.color);
          addToHistory({ repo: result.repo, rarity: result.rarity, timestamp: Date.now() });
          setTimeout(() => {
            setPhase("done");
            setFlashColor("transparent");
          }, 400);
        }
      }, 350);
    }, 500);
    return () => {};
  }, [phase, result, addToHistory]);

  const handleOpen = useCallback(() => {
    if (pulling || phase !== "idle") return;
    setPhase("idle");
    setFlippedIndices([]);
    reset();
    pull(language);
  }, [pulling, phase, reset, pull, language]);

  const handleCardClick = useCallback((index: number) => {
    if (phase !== "revealing") return;
    if (flippedIndices.includes(index)) return;
    setFlippedIndices((prev) => [...prev, index]);
    if (index === FAN_COUNT - 1 && result) {
      const c = RARITY_CONFIGS.find((x) => x.rarity === result.rarity)!;
      setFlashColor(c.color);
      addToHistory({ repo: result.repo, rarity: result.rarity, timestamp: Date.now() });
      setTimeout(() => {
        setPhase("done");
        setFlashColor("transparent");
      }, 400);
    }
  }, [phase, flippedIndices, result, addToHistory]);

  return (
    <div className="pack-container">
      {flashColor !== "transparent" && (
        <div
          className="screen-flash"
          style={{ background: `radial-gradient(circle at center, ${flashColor}44, transparent 70%)` }}
        />
      )}

      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.div
            key="pack"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.4 }}
            className="booster-pack"
            onClick={handleOpen}
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="booster-pack-inner">
              <div className="pack-foil" />
              <div className="pack-shine" />
              <div className="pack-seal" />
              <div className="pack-label">GHGACHA</div>
              <div className="pack-sub">BOOSTER PACK</div>
              <div className="pack-tear-line" />
              <div
                style={{
                  position: "absolute",
                  bottom: "20px",
                  fontFamily: "var(--font-display)",
                  fontSize: "9px",
                  color: "rgba(255,255,255,0.35)",
                  letterSpacing: "0.15em",
                  zIndex: 1,
                }}
              >
                TAP TO OPEN
              </div>
            </div>
          </motion.div>
        )}

        {phase === "ripping" && (
          <motion.div
            key="ripping"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{ textAlign: "center" }}
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 1, -1, 0],
              }}
              transition={{ duration: 0.4, repeat: 1 }}
              className="booster-pack"
              style={{ cursor: "default" }}
            >
              <div
                className="booster-pack-inner"
                style={{ boxShadow: `0 0 40px ${rarityCfg.color}66` }}
              >
                <div className="pack-foil" />
                <div className="pack-shine" />
                <div className="pack-seal" />
                <div className="pack-label">GHGACHA</div>
                <div className="pack-sub">BOOSTER PACK</div>
                <div className="pack-tear-line" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginTop: "12px",
                fontFamily: "var(--font-display)",
                fontSize: "11px",
                color: rarityCfg.color,
                letterSpacing: "0.1em",
              }}
            >
              {rarityCfg.label}
            </motion.div>
          </motion.div>
        )}

        {(phase === "fan" || phase === "revealing") && (
          <motion.div
            key="fan"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ width: "100%" }}
          >
            <div className="card-fan">
              {Array.from({ length: FAN_COUNT }).map((_, i) => {
                const isResult = i === Math.floor(FAN_COUNT / 2);
                const isFlipped = flippedIndices.includes(i);
                const cardRarity = isResult && result ? result.rarity : shuffleRarity;
                const cardCfg = RARITY_CONFIGS.find((x) => x.rarity === cardRarity)!;

                return (
                  <motion.div
                    key={i}
                    className={`fan-card ${isFlipped ? "flipped" : ""} ${isResult ? "result-card-slot" : ""}`}
                    initial={{ opacity: 0, x: FAN_X_OFFSETS[i] * 1.5, y: FAN_Y_OFFSETS[i] + 40 }}
                    animate={{
                      opacity: 1,
                      x: FAN_X_OFFSETS[i],
                      y: FAN_Y_OFFSETS[i],
                      rotateZ: FAN_ANGLES[i],
                      rotateY: isFlipped ? 180 : 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 180,
                      damping: 16,
                      delay: 0.1 * i,
                    }}
                    onClick={() => handleCardClick(i)}
                    style={{
                      zIndex: isResult ? 10 : 5 + i,
                      transformOrigin: "bottom center",
                      boxShadow: isFlipped && isResult ? `0 0 30px ${cardCfg.color}66` : "0 4px 12px rgba(0,0,0,0.1)",
                      "--card-color1": cardCfg.color,
                      "--card-color2": `${cardCfg.color}88`,
                    } as React.CSSProperties}
                    whileHover={!isFlipped && phase === "revealing" ? { y: FAN_Y_OFFSETS[i] - 8, scale: 1.05 } : {}}
                  >
                    <div className="fan-card-face fan-card-front">
                      <div
                        style={{
                          width: "80%",
                          height: "70%",
                          borderRadius: "6px",
                          background: `linear-gradient(145deg, ${cardCfg.color}22, ${cardCfg.color}11)`,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "4px",
                        }}
                      >
                        <div style={{ fontSize: "16px", opacity: 0.3 }}>?</div>
                        <div style={{ fontSize: "7px", opacity: 0.2, letterSpacing: "0.1em" }}>
                          {FILLER_LABELS[i]}
                        </div>
                      </div>
                    </div>
                    <div className="fan-card-face fan-card-back">
                      <div className="fan-card-back-pattern" />
                      <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "8px" }}>
                        {isResult && result ? (
                          <>
                            <img
                              src={result.repo.owner.avatar_url}
                              alt=""
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                border: `2px solid ${cardCfg.color}`,
                                marginBottom: "4px",
                              }}
                            />
                            <div style={{ fontSize: "7px", lineHeight: 1.3, wordBreak: "break-all" }}>
                              {result.repo.owner.login}
                            </div>
                          </>
                        ) : (
                          <>
                            <div style={{ fontSize: "18px", opacity: 0.5 }}>★</div>
                            <div style={{ fontSize: "7px", opacity: 0.6, marginTop: "4px" }}>
                              {cardCfg.label}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <div
              style={{
                textAlign: "center",
                marginTop: "12px",
                fontFamily: "var(--font-display)",
                fontSize: "10px",
                color: "var(--text-muted)",
                letterSpacing: "0.05em",
              }}
            >
              {phase === "fan" ? "✦" : "TAP CARDS TO REVEAL"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: "16px",
            padding: "12px 20px",
            borderRadius: "var(--radius-md)",
            background: "#fff0f0",
            border: "1px solid #ff2d7844",
            color: "#d63031",
            fontSize: "13px",
            textAlign: "center",
          }}
        >
          {error}
        </motion.div>
      )}

      {phase === "done" && result && (
        <motion.div
          key="result-detail"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 150, damping: 15 }}
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
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            onClick={handleOpen}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: "block",
              margin: "16px auto 0",
              padding: "12px 32px",
              borderRadius: "var(--radius-full)",
              border: "1px solid var(--accent)",
              background: "var(--bg-card)",
              color: "var(--accent)",
              fontFamily: "var(--font-display)",
              fontSize: "11px",
              letterSpacing: "0.1em",
              cursor: "pointer",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            OPEN ANOTHER PACK
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}