import { motion, AnimatePresence } from "framer-motion";
import { useFavorites } from "../hooks/useFavorites";
import { RarityBadge } from "./RarityBadge";

export function Favorites() {
  const { favorites, toggleFavorite } = useFavorites();

  return (
    <div>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 12, color: "var(--text-secondary)", letterSpacing: "0.05em", marginBottom: 14, padding: "0 2px" }}>
        FAVORITES <span style={{ color: "var(--text-muted)", fontSize: 11 }}>({favorites.length})</span>
      </h3>

      {favorites.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)", fontSize: 13 }}>
          <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.3 }}>⭐</div>
          No favorites yet
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <AnimatePresence>
            {favorites.map((item, i) => (
              <motion.div key={item.repo.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
                className="history-item" onClick={() => window.open(item.repo.html_url, "_blank")}>
                <img src={item.repo.owner.avatar_url} alt="" style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: "var(--text)", fontSize: 12, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.repo.full_name}</div>
                  <div style={{ fontSize: 9, color: "var(--text-muted)" }}>★ {item.repo.stargazers_count.toLocaleString()}</div>
                </div>
                <RarityBadge rarity={item.rarity} size="sm" />
                <motion.button onClick={(e) => { e.stopPropagation(); toggleFavorite(item); }} whileTap={{ scale: 0.8 }}
                  style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "var(--rarity-ur)", flexShrink: 0, lineHeight: 1 }}>
                  ★
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}