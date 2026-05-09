import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Rarity } from "../types";
import { RARITY_CONFIGS } from "../types";
import { ResultCard } from "./ResultCard";
import { useGacha } from "../hooks/useGacha";
import { useHistory } from "../hooks/useHistory";
import { useFavorites } from "../hooks/useFavorites";

interface Props { language: string }

const N = 5;
const ANGLES = [-24, -12, 0, 12, 24];
const X = [-84, -42, 0, 42, 84];
const Y = [18, 6, 0, 6, 18];
const RS: Rarity[] = ["N", "R", "SR", "UR"];

export function GachaMachine({ language }: Props) {
  const { pulling, result, error, pull, reset } = useGacha();
  const { addToHistory } = useHistory();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [phase, setPhase] = useState<"idle" | "open" | "fan" | "reveal" | "done">("idle");
  const [flipped, setFlipped] = useState<number[]>([]);
  const [sr, setSr] = useState<Rarity>("N");
  const [flash, setFlash] = useState("transparent");

  const rc = RARITY_CONFIGS.find((x) => x.rarity === sr)!;

  useEffect(() => {
    if (!pulling) return;
    setPhase("open");
    const iv = setInterval(() => setSr(RS[Math.floor(Math.random() * RS.length)]), 100);
    return () => clearInterval(iv);
  }, [pulling]);

  useEffect(() => {
    if (phase !== "open" || pulling) return;
    setTimeout(() => setPhase("fan"), 600);
  }, [phase, pulling]);

  useEffect(() => {
    if (phase !== "fan" || !result) return;
    setTimeout(() => {
      setPhase("reveal");
      let i = 0;
      const iv = setInterval(() => {
        setFlipped((p) => [...p, i]);
        i++;
        if (i >= N) {
          clearInterval(iv);
          const c = RARITY_CONFIGS.find((x) => x.rarity === result.rarity)!;
          setFlash(c.color);
          addToHistory({ repo: result.repo, rarity: result.rarity, timestamp: Date.now() });
          setTimeout(() => { setPhase("done"); setFlash("transparent"); }, 500);
        }
      }, 400);
    }, 500);
  }, [phase, result, addToHistory]);

  const handleOpen = useCallback(() => {
    if (pulling || phase !== "idle") return;
    setFlipped([]); reset(); pull(language);
  }, [pulling, phase, reset, pull, language]);

  const handleTap = useCallback((i: number) => {
    if (phase !== "reveal" || flipped.includes(i)) return;
    setFlipped((p) => [...p, i]);
    if (i === N - 1 && result) {
      const c = RARITY_CONFIGS.find((x) => x.rarity === result.rarity)!;
      setFlash(c.color);
      addToHistory({ repo: result.repo, rarity: result.rarity, timestamp: Date.now() });
      setTimeout(() => { setPhase("done"); setFlash("transparent"); }, 500);
    }
  }, [phase, flipped, result, addToHistory]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: 360, position: "relative" }}>
      {flash !== "transparent" && <div className="screen-flash" style={{ background: `radial-gradient(circle, ${flash}44, transparent 70%)` }} />}

      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.div key="pack" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: -20 }} className="pack" onClick={handleOpen}>
            <div className="pack-inner">
              <div className="pack-foil" />
              <div className="pack-seal" />
              <div className="pack-label">GHGACHA</div>
              <div className="pack-sub">BOOSTER PACK</div>
              <div className="pack-hint">TAP TO OPEN</div>
            </div>
          </motion.div>
        )}

        {phase === "open" && (
          <motion.div key="open" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: "center" }}>
            <motion.div animate={{ scale: [1, 1.04, 1], rotate: [0, 0.8, -0.8, 0] }} transition={{ duration: 0.4, repeat: 1 }} className="pack" style={{ cursor: "default", margin: "0 auto" }}>
              <div className="pack-inner" style={{ boxShadow: `inset 0 0 60px ${rc.color}55` }}>
                <div className="pack-foil" style={{ animationDuration: "0.6s" }} />
                <div className="pack-seal" />
                <div className="pack-label">GHGACHA</div>
                <div className="pack-sub">BOOSTER PACK</div>
              </div>
            </motion.div>
            <div style={{ marginTop: 12, fontFamily: "var(--font-display)", fontSize: 11, color: rc.color, letterSpacing: "0.12em" }}>{rc.label}</div>
          </motion.div>
        )}

        {(phase === "fan" || phase === "reveal") && (
          <motion.div key="fan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ width: "100%" }}>
            <div className="fan-area">
              {Array.from({ length: N }).map((_, i) => {
                const isC = i === Math.floor(N / 2);
                const isF = flipped.includes(i);
                const cr = isC && result ? result.rarity : sr;
                const cfg = RARITY_CONFIGS.find((x) => x.rarity === cr)!;
                return (
                  <motion.div
                    key={i}
                    className={`fan-card ${isF ? "flipped" : ""}`}
                    initial={{ opacity: 0, x: X[i] * 1.5, y: Y[i] + 30, rotateZ: ANGLES[i] * 1.3 }}
                    animate={{ opacity: 1, x: X[i], y: Y[i], rotateZ: ANGLES[i], rotateY: isF ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.06 * i }}
                    onClick={() => handleTap(i)}
                    style={{ zIndex: isC ? 10 : 5 + i, transformOrigin: "bottom center", boxShadow: isF && isC ? `0 0 30px ${cfg.color}77, 0 4px 16px rgba(0,0,0,0.1)` : "0 4px 16px rgba(0,0,0,0.1)" }}
                    whileHover={!isF && phase === "reveal" ? { y: Y[i] - 8, scale: 1.05 } : {}}
                  >
                    <div className="fan-card-face fan-card-front">
                      <div style={{ fontSize: 20, color: cfg.color, opacity: 0.2 }}>✦</div>
                    </div>
                    <div className="fan-card-face fan-card-back">
                      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.03) 4px, rgba(255,255,255,0.03) 5px)", borderRadius: 10 }} />
                      <div style={{ position: "absolute", top: 4, right: 4, padding: "1px 6px", borderRadius: 3, background: cfg.color, fontFamily: "var(--font-display)", fontSize: 6, letterSpacing: "0.08em", color: "#fff" }}>{cfg.label}</div>
                      {isC && result ? (
                        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: 8 }}>
                          <img src={result.repo.owner.avatar_url} alt="" style={{ width: 36, height: 36, borderRadius: "50%", border: `2px solid ${cfg.color}`, marginBottom: 4, boxShadow: `0 0 10px ${cfg.color}66` }} />
                          <div style={{ fontSize: 6, lineHeight: 1.2, opacity: 0.7, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 80 }}>{result.repo.owner.login}</div>
                          <div style={{ fontSize: 7, fontWeight: 700, marginTop: 1, fontFamily: "var(--font-display)" }}>★ {result.repo.stargazers_count.toLocaleString()}</div>
                        </div>
                      ) : (
                        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                          <div style={{ fontSize: 20, opacity: 0.3 }}>★</div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <div style={{ textAlign: "center", marginTop: 6, fontFamily: "var(--font-display)", fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.08em" }}>
              {phase === "fan" ? "✦" : "TAP CARDS"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div style={{ marginTop: 16, padding: "12px 20px", borderRadius: "var(--radius-md)", background: "#fff0f0", border: "1px solid #ff2d7844", color: "#d63031", fontSize: 13, textAlign: "center" }}>
          {error}
        </div>
      )}

      {phase === "done" && result && (
        <motion.div key="detail" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, type: "spring", stiffness: 160, damping: 16 }} style={{ width: "100%", marginTop: 20 }}>
          <ResultCard repo={result.repo} rarity={result.rarity} isFavorite={isFavorite(result.repo.id)} onToggleFavorite={() => toggleFavorite({ repo: result.repo, rarity: result.rarity, timestamp: Date.now() })} />
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} onClick={handleOpen} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            style={{ display: "block", margin: "14px auto 0", padding: "10px 28px", borderRadius: "var(--radius-full)", border: "1px solid var(--accent)", background: "#fff", color: "var(--accent)", fontFamily: "var(--font-display)", fontSize: 10, letterSpacing: "0.1em", cursor: "pointer", boxShadow: "var(--shadow-sm)" }}>
            OPEN ANOTHER PACK
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}