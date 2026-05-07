import { useHistory } from "../hooks/useHistory";
import { RarityBadge } from "./RarityBadge";

export function PullHistory() {
  const { history, clearHistory } = useHistory();

  if (history.length === 0) {
    return (
      <div style={{ textAlign: "center", color: "#666", padding: "24px" }}>
        No gacha history yet
      </div>
    );
  }

  return (
    <div style={{ padding: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h3 style={{ color: "#e0e0f0", margin: 0 }}>History ({history.length})</h3>
        <button
          onClick={clearHistory}
          style={{
            background: "none",
            border: "1px solid #444",
            borderRadius: "8px",
            padding: "6px 12px",
            color: "#888",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          Clear All
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {history.map((item) => (
          <div
            key={`${item.repo.id}-${item.timestamp}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px",
              borderRadius: "12px",
              background: "#1a1a2e",
              border: "1px solid #2a2a4a",
            }}
          >
            <img
              src={item.repo.owner.avatar_url}
              alt=""
              style={{ width: "32px", height: "32px", borderRadius: "50%" }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <a
                href={item.repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#c0c0d8", textDecoration: "none", fontSize: "14px", fontWeight: 600 }}
              >
                {item.repo.full_name}
              </a>
              <div style={{ fontSize: "11px", color: "#666" }}>
                {new Date(item.timestamp).toLocaleString()}
              </div>
            </div>
            <RarityBadge rarity={item.rarity} />
          </div>
        ))}
      </div>
    </div>
  );
}