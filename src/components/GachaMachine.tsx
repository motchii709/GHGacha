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

const CARD_COUNT = 5;
const ANGLES = [-28, -14, 0, 14, 28];
const X_OFF = [-96, -48, 0, 48, 96];
const Y_OFF = [24, 8, 0, 8, 24];
const RARITIES: Rarity[] = ["N", "R", "SR", "UR"];

export function GachaMachine({ language }: Props) {
  const { pulling, result, error, pull, reset } = useGacha();
  const { addToHistory } = useHistory();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [phase, setPhase] = useState<"idle" | "opening" | "fan" | "reveal" | "done">("idle");
  const [flipped, setFlipped] = useState<number[]>([]);
  const [shimmerRarity, setShimmerRarity] = useState<Rarity>("N");
  const [flashColor, setFlashColor] = useState("transparent");

  const rarityCfg = RARITY_CONFIGS.find((x) => x.rarity === shimmerRarity)!;

  useEffect(() => {
    if (!pulling) return;
    setPhase("opening");
    const iv = setInterval(() => {
      setShimmerRarity(RARITIES[Math.floor(Math.random() * RARITIES.length)]);
    }, 100);
    return () => clearInterval(iv);
  }, [pulling]);

  useEffect(() => {
    if (phase !== "opening" || pulling) return;
    const t = setTimeout(() => setPhase("fan"), 700);
    return () => clearTimeout(t);
  }, [phase, pulling]);

  useEffect(() => {
    if (phase !== "fan" || !result) return;
    const t = setTimeout(() => {
      setPhase("reveal");
      let i = 0;
      const iv = setInterval(() => {
        setFlipped((p) => [...p, i]);
        i++;
        if (i >= CARD_COUNT) {
          clearInterval(iv);
          const c = RARITY_CONFIGS.find((x) => x.rarity === result.rarity)!;
          setFlashColor(c.color);
          addToHistory({ repo: result.repo, rarity: result.rarity, timestamp: Date.now() });
          setTimeout(() => { setPhase("done"); setFlashColor("transparent"); }, 500);
        }
      }, 400);
    }, 600);
    return () => clearTimeout(t);
  }, [phase, result, addToHistory]);

  const handleOpen = useCallback(() => {
    if (pulling || phase !== "idle") return;
    setFlipped([]);
    reset();
    pull(language);
  }, [pulling, phase, reset, pull, language]);

  const handleCardTap = useCallback((i: number) => {
    if (phase !== "reveal" || flipped.includes(i)) return;
    setFlipped((p) => [...p, i]);
    if (i === CARD_COUNT - 1 && result) {
      const c = RARITY_CONFIGS.find((x) => x.rarity === result.rarity)!;
      setFlashColor(c.color);
      addToHistory({ repo: result.repo, rarity: result.rarity, timestamp: Date.now() });
      setTimeout(() => { setPhase("done"); setFlashColor("transparent"); }, 500);
    }
  }, [phase, flipped, result, addToHistory]);

  return (
    <div className="gacha-root">
      {flashColor !== "transparent" && (
        <div className="screen-flash" style={{ background: `radial-gradient(circle, ${flashColor}55, transparent 70%)` }} />
      )}

      <AnimatePresence mode="wait">
        {/* ── IDLE: Booster Pack ── */}
        {phase === "idle" && (
          <motion.div
            key="pack"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -30 }}
            transition={{ duration: 0.4 }}
            className="pack-wrapper"
            onClick={handleOpen}
          >
            <div className="booster-pack">
              <div className="pack-body">
                <div className="pack-foil" />
                <div className="pack-shine" />
                <div className="pack-top-seal" />
                <div className="pack-stripe" />
                <div className="pack-stripe" />
                <div className="pack-brand">GHGACHA</div>
                <div className="pack-brand-sub">BOOSTER PACK</div>
                <div className="pack-hint">TAP TO OPEN</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── OPENING: Pack glows and shakes ── */}
        {phase === "opening" && (
          <motion.div
            key="opening"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ textAlign: "center" }}
          >
            <motion.div
              animate={{ scale: [1, 1.04, 1], rotate: [0, 0.8, -0.8, 0] }}
              transition={{ duration: 0.35, repeat: 1 }}
              className="booster-pack"
              style={{ cursor: "default", margin: "0 auto" }}
            >
              <div
                className="pack-body"
                style={{ boxShadow: `inset 0 0 60px ${rarityCfg.color}55` }}
              >
                <div className="pack-foil" />
                <div className="pack-shine" />
                <div className="pack-top-seal" />
                <div className="pack-stripe" />
                <div className="pack-stripe" />
                <div className="pack-brand">GHGACHA</div>
                <div className="pack-brand-sub">BOOSTER PACK</div>
                <div className="rip-overlay" style={{
                  background: `radial-gradient(circle at center, ${rarityCfg.color}33, transparent 70%)`,
                  animation: "pulse-text 0.5s ease-in-out infinite",
                }} />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rip-label"
              style={{ color: rarityCfg.color }}
            >
              {rarityCfg.label}
            </motion.div>
          </motion.div>
        )}

        {/* ── FAN + REVEAL: Cards spread and flip ── */}
        {(phase === "fan" || phase === "reveal") && (
          <motion.div
            key="fan"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ width: "100%" }}
          >
            <div className="card-fan-area">
              {Array.from({ length: CARD_COUNT }).map((_, i) => {
                const isCenter = i === Math.floor(CARD_COUNT / 2);
                const isFlipped = flipped.includes(i);
                const cardRarity = isCenter && result ? result.rarity : shimmerRarity;
                const cfg = RARITY_CONFIGS.find((x) => x.rarity === cardRarity)!;

                return (
                  <motion.div
                    key={i}
                    className={`fan-card ${isFlipped ? "flipped" : ""}`}
                    initial={{ opacity: 0, x: X_OFF[i] * 1.6, y: Y_OFF[i] + 50, rotateZ: ANGLES[i] * 1.3 }}
                    animate={{
                      opacity: 1,
                      x: X_OFF[i],
                      y: Y_OFF[i],
                      rotateZ: ANGLES[i],
                      rotateY: isFlipped ? 180 : 0,
                    }}
                    transition={{
                      type: "spring", stiffness: 200, damping: 18,
                      delay: 0.08 * i,
                    }}
                    onClick={() => handleCardTap(i)}
                    style={{
                      zIndex: isCenter ? 10 : 5 + i,
                      transformOrigin: "bottom center",
                      boxShadow: isFlipped && isCenter
                        ? `0 0 30px ${cfg.color}88, 0 4px 16px rgba(0,0,0,0.12)`
                        : "0 4px 16px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06)",
                    }}
                    whileHover={!isFlipped && phase === "reveal" ? { y: Y_OFF[i] - 10, scale: 1.06 } : {}}
                  >
                    {/* Front face */}
                    <div className="fan-card-face fan-card-front">
                      <div
                        style={{
                          width: "76%",
                          height: "65%",
                          borderRadius: "6px",
                          background: `linear-gradient(145deg, ${cfg.color}18, ${cfg.color}08)`,
                          border: `1px solid ${cfg.color}22`,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px",
                        }}
                      >
                        <div style={{ fontSize: "22px", color: cfg.color, opacity: 0.25 }}>✦</div>
                        <div style={{ fontSize: "7px", color: cfg.color, opacity: 0.15, letterSpacing: "0.12em" }}>
                          {isCenter ? "★ HIT ★" : `SLOT ${i + 1}`}
                        </div>
                      </div>
                    </div>

                    {/* Back face */}
                    <div className="fan-card-face fan-card-back">
                      <div className="fan-card-back-pattern" />
                      <div
                        className="card-rarity-tag"
                        style={{
                          background: cfg.color,
                          color: "#fff",
                        }}
                      >
                        {cfg.label}
                      </div>
                      {isCenter && result ? (
                        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "10px" }}>
                          <img
                            src={result.repo.owner.avatar_url}
                            alt=""
                            style={{
                              width: "44px",
                              height: "44px",
                              borderRadius: "50%",
                              border: `2px solid ${cfg.color}`,
                              marginBottom: "6px",
                              boxShadow: `0 0 12px ${cfg.color}66`,
                            }}
                          />
                          <div style={{
                            fontSize: "7px",
                            lineHeight: 1.3,
                            opacity: 0.8,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: "100px",
                          }}>
                            {result.repo.owner.login}
                          </div>
                          <div style={{
                            fontSize: "8px",
                            fontWeight: 700,
                            marginTop: "2px",
                            fontFamily: "var(--font-display)",
                            letterSpacing: "0.05em",
                          }}>
                            ★ {result.repo.stargazers_count.toLocaleString()}
                          </div>
                        </div>
                      ) : (
                        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                          <div style={{ fontSize: "24px", opacity: 0.4 }}>★</div>
                          <div style={{ fontSize: "7px", opacity: 0.5, marginTop: "4px", letterSpacing: "0.1em" }}>
                            {cfg.label}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{
                textAlign: "center",
                marginTop: "8px",
                fontFamily: "var(--font-display)",
                fontSize: "10px",
                color: "var(--text-muted)",
                letterSpacing: "0.08em",
              }}
            >
              {phase === "fan" ? "✦" : "TAP CARDS"}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Error ── */}
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

      {/* ── Done: Result Card ── */}
      {phase === "done" && result && (
        <motion.div
          key="detail"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, type: "spring", stiffness: 160, damping: 16 }}
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
            transition={{ delay: 0.5 }}
            onClick={handleOpen}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: "block",
              margin: "16px auto 0",
              padding: "12px 32px",
              borderRadius: "var(--radius-full)",
              border: "1px solid var(--accent)",
              background: "#fff",
              color: "var(--accent)",
              fontFamily: "var(--font-display)",
              fontSize: "11px",
              letterSpacing: "0.1em",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            OPEN ANOTHER PACK
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}