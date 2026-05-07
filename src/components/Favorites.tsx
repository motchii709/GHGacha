import { useFavorites } from "../hooks/useFavorites";
import { RarityBadge } from "./RarityBadge";

export function Favorites() {
  const { favorites, toggleFavorite } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div style={{ textAlign: "center", color: "#666", padding: "24px" }}>
        No favorites yet. Star a result to add it here.
      </div>
    );
  }

  return (
    <div style={{ padding: "16px" }}>
      <h3 style={{ color: "#e0e0f0", marginBottom: "16px" }}>Favorites ({favorites.length})</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {favorites.map((item) => (
          <div
            key={item.repo.id}
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
                ⭐ {item.repo.stargazers_count.toLocaleString()}
              </div>
            </div>
            <RarityBadge rarity={item.rarity} />
            <button
              onClick={() => toggleFavorite(item)}
              style={{
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                color: "#f59e0b",
              }}
            >
              ★
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}