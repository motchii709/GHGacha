import { motion } from "framer-motion";
import type { GitHubRepo, Rarity } from "../types";
import { RARITY_CONFIGS } from "../types";
import { RarityBadge } from "./RarityBadge";

interface Props {
  repo: GitHubRepo;
  rarity: Rarity;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function ResultCard({ repo, rarity, isFavorite, onToggleFavorite }: Props) {
  const c = RARITY_CONFIGS.find((x) => x.rarity === rarity)!;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        maxWidth: "500px",
        width: "100%",
        margin: "0 auto",
      }}
    >
      {/* Card frame */}
      <div
        style={{
          position: "relative",
          borderRadius: "16px",
          padding: "3px",
          background: `linear-gradient(160deg, ${c.color}, ${c.color}66, ${c.color}33)`,
          boxShadow: `0 0 40px ${c.color}44, 0 8px 32px rgba(0,0,0,0.3)`,
        }}
      >
        <div
          style={{
            borderRadius: "14px",
            background: "#1a1a2e",
            overflow: "hidden",
          }}
        >
          {/* Card header with rarity bar */}
          <div
            style={{
              height: "4px",
              background: `linear-gradient(90deg, ${c.color}, ${c.color}88)`,
            }}
          />

          {/* Card illustration area */}
          <div
            style={{
              position: "relative",
              height: "180px",
              background: `linear-gradient(160deg, ${c.color}22, #0d0d1a)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(circle at 50% 40%, ${c.color}15, transparent 70%)`,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                zIndex: 2,
              }}
            >
              <RarityBadge rarity={rarity} />
            </div>
            <motion.button
              onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
              whileTap={{ scale: 0.8 }}
              style={{
                position: "absolute",
                top: "12px",
                left: "12px",
                background: "none",
                border: "none",
                fontSize: "22px",
                cursor: "pointer",
                color: isFavorite ? c.color : "#333350",
                zIndex: 2,
                lineHeight: 1,
              }}
            >
              {isFavorite ? "★" : "☆"}
            </motion.button>
            <img
              src={repo.owner.avatar_url}
              alt={repo.owner.login}
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                border: `3px solid ${c.color}`,
                boxShadow: `0 0 30px ${c.color}66`,
                zIndex: 1,
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "12px",
                left: "50%",
                transform: "translateX(-50%)",
                fontFamily: "var(--font-display)",
                fontSize: "9px",
                color: c.color,
                letterSpacing: "0.15em",
                opacity: 0.5,
                zIndex: 1,
              }}
            >
              {repo.language || "CODE"}
            </div>
          </div>

          {/* Card body */}
          <div style={{ padding: "16px 18px 18px" }}>
            {/* Title */}
            <div style={{ marginBottom: "10px" }}>
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "16px",
                  color: "#f0f0ff",
                  textDecoration: "none",
                  letterSpacing: "0.02em",
                  display: "block",
                  lineHeight: 1.3,
                }}
              >
                {repo.full_name}
              </a>
              <div style={{ fontSize: "11px", color: "#666680", marginTop: "2px" }}>
                @{repo.owner.login}
              </div>
            </div>

            {/* Flavor text (description) */}
            {repo.description && (
              <div
                style={{
                  fontSize: "12px",
                  color: "#8888aa",
                  lineHeight: 1.6,
                  marginBottom: "14px",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  background: "rgba(0,0,0,0.2)",
                  borderLeft: `2px solid ${c.color}44`,
                  fontStyle: "italic",
                }}
              >
                {repo.description}
              </div>
            )}

            {/* Stats row - ATK/DEF style */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "14px",
              }}
            >
              <div
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  borderRadius: "10px",
                  background: "rgba(0,0,0,0.25)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div style={{ fontSize: "9px", color: "#666680", letterSpacing: "0.08em", marginBottom: "2px" }}>
                  ATK
                </div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "#ff6b6b", fontFamily: "var(--font-display)" }}>
                  {repo.stargazers_count.toLocaleString()}
                </div>
                <div style={{ fontSize: "8px", color: "#555570", marginTop: "1px" }}>
                  ★ STARS
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  borderRadius: "10px",
                  background: "rgba(0,0,0,0.25)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div style={{ fontSize: "9px", color: "#666680", letterSpacing: "0.08em", marginBottom: "2px" }}>
                  DEF
                </div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "#4d9eff", fontFamily: "var(--font-display)" }}>
                  {repo.forks_count.toLocaleString()}
                </div>
                <div style={{ fontSize: "8px", color: "#555570", marginTop: "1px" }}>
                  ⑂ FORKS
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  borderRadius: "10px",
                  background: "rgba(0,0,0,0.25)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div style={{ fontSize: "9px", color: "#666680", letterSpacing: "0.08em", marginBottom: "2px" }}>
                  HP
                </div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "#51cf66", fontFamily: "var(--font-display)" }}>
                  {repo.watchers_count.toLocaleString()}
                </div>
                <div style={{ fontSize: "8px", color: "#555570", marginTop: "1px" }}>
                  ● WATCH
                </div>
              </div>
            </div>

            {/* Topics as card types */}
            {repo.topics.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "12px" }}>
                {repo.topics.slice(0, 6).map((topic) => (
                  <span
                    key={topic}
                    style={{
                      padding: "2px 8px",
                      borderRadius: "4px",
                      background: `${c.color}15`,
                      color: c.color,
                      fontSize: "9px",
                      border: `1px solid ${c.color}22`,
                      fontFamily: "var(--font-display)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {topic}
                  </span>
                ))}
              </div>
            )}

            {/* Footer info */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "10px",
                borderTop: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div style={{ fontSize: "10px", color: "#555570" }}>
                {repo.license?.spdx_id ? `📄 ${repo.license.spdx_id}` : ""}
              </div>
              <div style={{ fontSize: "10px", color: "#555570" }}>
                🕐 {new Date(repo.updated_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action button */}
      <motion.a
        href={repo.html_url}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{
          display: "block",
          textAlign: "center",
          marginTop: "14px",
          padding: "12px",
          borderRadius: "12px",
          background: `linear-gradient(135deg, ${c.color}, ${c.color}88)`,
          color: "#fff",
          fontFamily: "var(--font-display)",
          fontSize: "12px",
          letterSpacing: "0.12em",
          textDecoration: "none",
          boxShadow: `0 0 20px ${c.color}44`,
        }}
      >
        OPEN ON GITHUB →
      </motion.a>
    </motion.div>
  );
}