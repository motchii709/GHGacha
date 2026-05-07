import { useState } from "react";
import { LanguageSelector } from "./components/LanguageSelector";
import { GachaMachine } from "./components/GachaMachine";
import { PullHistory } from "./components/PullHistory";
import { Favorites } from "./components/Favorites";
import "./styles/index.css";
import "./styles/gacha.css";

type Tab = "gacha" | "history" | "favorites";

function App() {
  const [language, setLanguage] = useState("TypeScript");
  const [tab, setTab] = useState<Tab>("gacha");

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f23" }}>
      <header
        style={{
          textAlign: "center",
          padding: "24px 16px 8px",
          borderBottom: "1px solid #1a1a2e",
        }}
      >
        <h1 style={{ fontSize: "28px", fontWeight: 800, background: "linear-gradient(135deg, #667eea, #764ba2)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          GHGacha
        </h1>
        <p style={{ color: "#666", fontSize: "13px", marginTop: "4px" }}>
          GitHub Repository Gacha
        </p>
      </header>

      <LanguageSelector selected={language} onSelect={setLanguage} />

      <nav style={{ display: "flex", justifyContent: "center", gap: "4px", padding: "0 16px" }}>
        {(["gacha", "history", "favorites"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "8px 20px",
              border: "none",
              borderBottom: tab === t ? "2px solid #667eea" : "2px solid transparent",
              background: "none",
              color: tab === t ? "#e0e0f0" : "#666",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: tab === t ? 700 : 400,
              transition: "all 0.2s",
              textTransform: "capitalize",
            }}
          >
            {t === "gacha" ? "🎰 Gacha" : t === "history" ? "📜 History" : "⭐ Favorites"}
          </button>
        ))}
      </nav>

      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "16px" }}>
        {tab === "gacha" && <GachaMachine language={language} />}
        {tab === "history" && <PullHistory />}
        {tab === "favorites" && <Favorites />}
      </main>
    </div>
  );
}

export default App;