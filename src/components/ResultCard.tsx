import { motion } from "framer-motion";
import type { GitHubRepo, Rarity } from "../types";
import { RARITY_CONFIGS } from "../types";
import { RarityBadge } from "./RarityBadge";
import { ReadmePreview } from "./ReadmePreview";

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
      className={`result-card ${c.cssClass}`}
      style={{
        maxWidth: "580px",
        width: "100%",
        margin: "0 auto",
        borderRadius: "var(--radius-lg)",
        background: `linear-gradient(145deg, #ffffff 0%, #f8f8fc 100%)`,
        border: `1px solid ${c.color}33`,
      }}
    >
      <div className="result-card-inner" style={{ padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "18px" }}>
          <div style={{ position: "relative" }}>
            <img
              src={repo.owner.avatar_url}
              alt={repo.owner.login}
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "14px",
                border: `2px solid ${c.color}44`,
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: -3,
                borderRadius: "17px",
                border: `1px solid ${c.color}22`,
                pointerEvents: "none",
              }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "2px" }}>
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "15px",
                  color: c.color,
                  textDecoration: "none",
                  letterSpacing: "0.02em",
                  transition: "text-shadow 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.textShadow = `0 0 12px ${c.color}66`; }}
                onMouseLeave={(e) => { e.currentTarget.style.textShadow = "none"; }}
              >
                {repo.full_name}
              </a>
              <RarityBadge rarity={rarity} />
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              @{repo.owner.login}
            </div>
          </div>
          <motion.button
            className="fav-btn"
            onClick={onToggleFavorite}
            whileTap={{ scale: 0.8 }}
            style={{ color: isFavorite ? c.color : "#333350", flexShrink: 0 }}
          >
            {isFavorite ? "★" : "☆"}
          </motion.button>
        </div>

        {repo.description && (
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "13px",
              lineHeight: 1.7,
              marginBottom: "18px",
              padding: "12px 14px",
              borderRadius: "var(--radius-sm)",
background: "rgba(0,0,0,0.02)",
            borderLeft: `2px solid ${c.color}66`,
            }}
          >
            {repo.description}
          </p>
        )}

        <div
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "16px",
            padding: "12px 14px",
            borderRadius: "var(--radius-sm)",
            background: "rgba(0,0,0,0.02)",
          }}
        >
          {[
            { label: "Stars", value: repo.stargazers_count.toLocaleString(), icon: "★" },
            { label: "Forks", value: repo.forks_count.toLocaleString(), icon: "⑂" },
            { label: "Watchers", value: repo.watchers_count.toLocaleString(), icon: "●" },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: "center", flex: 1 }}>
              <div style={{ fontSize: "16px", fontWeight: 700, color: c.color, fontFamily: "var(--font-display)" }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.05em" }}>
                {stat.icon} {stat.label}
              </div>
            </div>
          ))}
        </div>

        {repo.topics.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "16px" }}>
            {repo.topics.slice(0, 10).map((topic) => (
              <span
                key={topic}
                style={{
                  padding: "3px 10px",
                  borderRadius: "var(--radius-full)",
                  background: `${c.color}11`,
                  color: c.color,
                  fontSize: "11px",
                  border: `1px solid ${c.color}22`,
                }}
              >
                #{topic}
              </span>
            ))}
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: "12px",
            fontSize: "11px",
            color: "var(--text-muted)",
            marginBottom: "16px",
            flexWrap: "wrap",
          }}
        >
          {repo.language && (
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: c.color }} />
              {repo.language}
            </span>
          )}
          {repo.license?.spdx_id && <span>📄 {repo.license.spdx_id}</span>}
          <span>🕐 {new Date(repo.updated_at).toLocaleDateString()}</span>
        </div>

        <ReadmePreview owner={repo.owner.login} name={repo.name} rarityColor={c.color} />

        <motion.a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            display: "block",
            textAlign: "center",
            marginTop: "16px",
            padding: "12px",
            borderRadius: "var(--radius-sm)",
            background: `linear-gradient(135deg, ${c.color}88, ${c.color}44)`,
            color: "#fff",
            fontFamily: "var(--font-display)",
            fontSize: "12px",
            letterSpacing: "0.1em",
            textDecoration: "none",
            border: `1px solid ${c.color}66`,
          }}
        >
          OPEN ON GITHUB →
        </motion.a>
      </div>
    </motion.div>
  );
}