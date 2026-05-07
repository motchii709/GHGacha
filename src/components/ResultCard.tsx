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
  const config = RARITY_CONFIGS.find((c) => c.rarity === rarity)!;

  return (
    <motion.div
      initial={{ rotateY: 180, opacity: 0, scale: 0.8 }}
      animate={{ rotateY: 0, opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        maxWidth: "560px",
        width: "100%",
        margin: "24px auto",
        padding: "24px",
        borderRadius: "16px",
        background: "linear-gradient(135deg, #1e1e3a 0%, #2a2a4a 100%)",
        border: `1px solid ${config.color}44`,
        boxShadow: `0 0 30px ${config.glowColor}33, 0 0 60px ${config.glowColor}11`,
        color: "#e0e0f0",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
        <img
          src={repo.owner.avatar_url}
          alt={repo.owner.login}
          style={{ width: "48px", height: "48px", borderRadius: "50%" }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: config.color, fontWeight: 700, fontSize: "18px", textDecoration: "none" }}
            >
              {repo.full_name}
            </a>
            <RarityBadge rarity={rarity} />
          </div>
          <div style={{ fontSize: "13px", color: "#8888aa" }}>@{repo.owner.login}</div>
        </div>
        <button
          onClick={onToggleFavorite}
          style={{
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            color: isFavorite ? "#f59e0b" : "#555",
            transition: "color 0.2s",
          }}
        >
          {isFavorite ? "★" : "☆"}
        </button>
      </div>

      {repo.description && (
        <p style={{ color: "#c0c0d8", fontSize: "14px", lineHeight: 1.5, marginBottom: "16px" }}>
          {repo.description}
        </p>
      )}

      <div style={{ display: "flex", gap: "16px", marginBottom: "16px", fontSize: "14px" }}>
        <span>⭐ {repo.stargazers_count.toLocaleString()}</span>
        <span>⑂ {repo.forks_count.toLocaleString()}</span>
        <span>👁 {repo.watchers_count.toLocaleString()}</span>
      </div>

      {repo.topics.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
          {repo.topics.slice(0, 8).map((topic) => (
            <span
              key={topic}
              style={{
                padding: "2px 8px",
                borderRadius: "8px",
                background: `${config.color}22`,
                color: config.color,
                fontSize: "12px",
              }}
            >
              {topic}
            </span>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: "16px", fontSize: "13px", color: "#8888aa", marginBottom: "16px" }}>
        {repo.language && <span>🔤 {repo.language}</span>}
        {repo.license?.spdx_id && <span>📄 {repo.license.spdx_id}</span>}
        <span>🕐 {new Date(repo.updated_at).toLocaleDateString()}</span>
      </div>

      <ReadmePreview owner={repo.owner.login} name={repo.name} />

      <a
        href={repo.html_url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "block",
          textAlign: "center",
          marginTop: "16px",
          padding: "10px",
          borderRadius: "8px",
          background: config.color,
          color: "#fff",
          fontWeight: 700,
          textDecoration: "none",
          fontSize: "14px",
        }}
      >
        Open in GitHub →
      </a>
    </motion.div>
  );
}