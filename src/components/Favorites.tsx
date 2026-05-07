import { motion, AnimatePresence } from "framer-motion";
import { useFavorites } from "../hooks/useFavorites";
import { RarityBadge } from "./RarityBadge";

export function Favorites() {
  const { favorites, toggleFavorite } = useFavorites();

  return (
    <div style={{ padding: "8px 0" }}>
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "14px",
          color: "var(--text-secondary)",
          letterSpacing: "0.05em",
          marginBottom: "16px",
          padding: "0 4px",
        }}
      >
        FAVORITES
        <span style={{ color: "var(--text-muted)", marginLeft: "8px", fontSize: "12px" }}>
          ({favorites.length})
        </span>
      </h3>

      {favorites.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            color: "var(--text-muted)",
            fontSize: "13px",
          }}
        >
          <div style={{ fontSize: "32px", marginBottom: "8px", opacity: 0.3 }}>⭐</div>
          No favorites yet. Star a result to save it here.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <AnimatePresence>
            {favorites.map((item, i) => (
              <motion.div
                key={item.repo.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="history-item"
                onClick={() => window.open(item.repo.html_url, "_blank")}
              >
                <img
                  src={item.repo.owner.avatar_url}
                  alt=""
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "10px",
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      color: "var(--text-primary)",
                      fontSize: "13px",
                      fontWeight: 500,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.repo.full_name}
                  </div>
                  <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                    ★ {item.repo.stargazers_count.toLocaleString()}
                  </div>
                </div>
                <RarityBadge rarity={item.rarity} size="sm" />
                <motion.button
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(item); }}
                  whileTap={{ scale: 0.8 }}
                  className="fav-btn"
                  style={{ color: "var(--rarity-ur)", flexShrink: 0 }}
                >
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