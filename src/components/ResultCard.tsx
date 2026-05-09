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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ maxWidth: 440, width: "100%", margin: "0 auto" }}
    >
      {/* Rarity border glow */}
      <div style={{ position: "relative", borderRadius: 18, padding: 2, background: `linear-gradient(160deg, ${c.color}, ${c.color}44)`, boxShadow: `0 0 30px ${c.color}33` }}>
        <div className="tcg-card">
          {/* Illustration area */}
          <div className="tcg-card-illust" style={{ background: `linear-gradient(160deg, ${c.color}15, #f0f0f5)` }}>
            <div style={{ position: "absolute", top: 10, right: 10, zIndex: 2 }}><RarityBadge rarity={rarity} /></div>
            <motion.button onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }} whileTap={{ scale: 0.8 }}
              style={{ position: "absolute", top: 10, left: 10, background: "none", border: "none", fontSize: 20, cursor: "pointer", color: isFavorite ? c.color : "#ddd", zIndex: 2, lineHeight: 1 }}>
              {isFavorite ? "★" : "☆"}
            </motion.button>
            <img src={repo.owner.avatar_url} alt={repo.owner.login}
              style={{ width: 72, height: 72, borderRadius: "50%", border: `3px solid ${c.color}`, boxShadow: `0 0 24px ${c.color}55`, zIndex: 1 }} />
            <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", fontFamily: "var(--font-display)", fontSize: 8, color: c.color, letterSpacing: "0.12em", opacity: 0.5, zIndex: 1 }}>
              {repo.language || "CODE"}
            </div>
          </div>

          {/* Body */}
          <div className="tcg-card-body">
            <div style={{ marginBottom: 10 }}>
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: "var(--font-display)", fontSize: 15, color: "var(--text)", textDecoration: "none", display: "block", lineHeight: 1.3 }}>
                {repo.full_name}
              </a>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>@{repo.owner.login}</div>
            </div>

            {repo.description && (
              <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 14, padding: "10px 12px", borderRadius: 8, background: "#f5f5fa", borderLeft: `2px solid ${c.color}55`, fontStyle: "italic" }}>
                {repo.description}
              </div>
            )}

            <div className="tcg-stats">
              <div className="tcg-stat">
                <div className="tcg-stat-label">★ ATK</div>
                <div className="tcg-stat-value" style={{ color: "#ff6b6b" }}>{repo.stargazers_count.toLocaleString()}</div>
                <div className="tcg-stat-sub">STARS</div>
              </div>
              <div className="tcg-stat">
                <div className="tcg-stat-label">⑂ DEF</div>
                <div className="tcg-stat-value" style={{ color: "#4d9eff" }}>{repo.forks_count.toLocaleString()}</div>
                <div className="tcg-stat-sub">FORKS</div>
              </div>
              <div className="tcg-stat">
                <div className="tcg-stat-label">● HP</div>
                <div className="tcg-stat-value" style={{ color: "#51cf66" }}>{repo.watchers_count.toLocaleString()}</div>
                <div className="tcg-stat-sub">WATCH</div>
              </div>
            </div>

            {repo.topics.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
                {repo.topics.slice(0, 6).map((t) => (
                  <span key={t} style={{ padding: "2px 8px", borderRadius: 4, background: `${c.color}10`, color: c.color, fontSize: 9, border: `1px solid ${c.color}22`, fontFamily: "var(--font-display)", letterSpacing: "0.05em" }}>{t}</span>
                ))}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: "1px solid #eeeef4" }}>
              <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{repo.license?.spdx_id ? `📄 ${repo.license.spdx_id}` : ""}</span>
              <span style={{ fontSize: 10, color: "var(--text-muted)" }}>🕐 {new Date(repo.updated_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      <motion.a href={repo.html_url} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        style={{ display: "block", textAlign: "center", marginTop: 12, padding: "11px", borderRadius: 12, background: `linear-gradient(135deg, ${c.color}, ${c.color}88)`, color: "#fff", fontFamily: "var(--font-display)", fontSize: 11, letterSpacing: "0.12em", textDecoration: "none", boxShadow: `0 0 16px ${c.color}33` }}>
        OPEN ON GITHUB →
      </motion.a>
    </motion.div>
  );
}