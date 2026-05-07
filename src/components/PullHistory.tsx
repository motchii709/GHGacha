import { motion, AnimatePresence } from "framer-motion";
import { useHistory } from "../hooks/useHistory";
import { RarityBadge } from "./RarityBadge";

export function PullHistory() {
  const { history, clearHistory } = useHistory();

  return (
    <div style={{ padding: "8px 0" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          padding: "0 4px",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "14px",
            color: "var(--text-secondary)",
            letterSpacing: "0.05em",
          }}
        >
          PULL HISTORY
          <span style={{ color: "var(--text-muted)", marginLeft: "8px", fontSize: "12px" }}>
            ({history.length})
          </span>
        </h3>
        {history.length > 0 && (
          <motion.button
            onClick={clearHistory}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "6px 14px",
              borderRadius: "var(--radius-full)",
              border: "1px solid #333350",
              background: "transparent",
              color: "var(--text-muted)",
              cursor: "pointer",
              fontSize: "11px",
              fontFamily: "var(--font-body)",
            }}
          >
            CLEAR ALL
          </motion.button>
        )}
      </div>

      {history.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            color: "var(--text-muted)",
            fontSize: "13px",
          }}
        >
          <div style={{ fontSize: "32px", marginBottom: "8px", opacity: 0.3 }}>🎰</div>
          No pulls yet. Spin the gacha!
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <AnimatePresence>
            {history.map((item, i) => (
              <motion.div
                key={`${item.repo.id}-${item.timestamp}`}
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
                    {new Date(item.timestamp).toLocaleString()}
                  </div>
                </div>
                <RarityBadge rarity={item.rarity} size="sm" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}