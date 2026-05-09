import { motion, AnimatePresence } from "framer-motion";
import { useHistory } from "../hooks/useHistory";
import { RarityBadge } from "./RarityBadge";

export function PullHistory() {
  const { history, clearHistory } = useHistory();

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, padding: "0 2px" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 12, color: "var(--text-secondary)", letterSpacing: "0.05em" }}>
          PULL HISTORY <span style={{ color: "var(--text-muted)", fontSize: 11 }}>({history.length})</span>
        </h3>
        {history.length > 0 && (
          <motion.button onClick={clearHistory} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            style={{ padding: "5px 12px", borderRadius: "var(--radius-full)", border: "1px solid #eee", background: "transparent", color: "var(--text-muted)", cursor: "pointer", fontSize: 10, fontFamily: "var(--font-body)" }}>
            CLEAR
          </motion.button>
        )}
      </div>

      {history.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)", fontSize: 13 }}>
          <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.3 }}>🎰</div>
          No pulls yet
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <AnimatePresence>
            {history.map((item, i) => (
              <motion.div key={`${item.repo.id}-${item.timestamp}`} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
                className="history-item" onClick={() => window.open(item.repo.html_url, "_blank")}>
                <img src={item.repo.owner.avatar_url} alt="" style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: "var(--text)", fontSize: 12, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.repo.full_name}</div>
                  <div style={{ fontSize: 9, color: "var(--text-muted)" }}>{new Date(item.timestamp).toLocaleString()}</div>
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