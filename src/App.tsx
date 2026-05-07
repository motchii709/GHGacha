import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LanguageSelector } from "./components/LanguageSelector";
import { GachaMachine } from "./components/GachaMachine";
import { PullHistory } from "./components/PullHistory";
import { Favorites } from "./components/Favorites";
import "./styles/index.css";
import "./styles/gacha.css";

type Tab = "gacha" | "history" | "favorites";

const TAB_LABELS: Record<Tab, { label: string; icon: string }> = {
  gacha: { label: "GACHA", icon: "🎯" },
  history: { label: "HISTORY", icon: "📋" },
  favorites: { label: "FAVORITES", icon: "★" },
};

function App() {
  const [language, setLanguage] = useState("TypeScript");
  const [tab, setTab] = useState<Tab>("gacha");

  return (
    <div style={{ minHeight: "100vh", paddingBottom: "40px" }}>
      <header
        style={{
          textAlign: "center",
          padding: "32px 16px 12px",
          position: "relative",
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 6vw, 42px)",
            fontWeight: 400,
            letterSpacing: "0.15em",
            background: "linear-gradient(135deg, #00f0ff 0%, #b44dff 50%, #ff2d78 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "none",
            filter: "drop-shadow(0 0 30px rgba(0, 240, 255, 0.15))",
          }}
        >
          GHGACHA
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "11px",
            color: "var(--text-muted)",
            letterSpacing: "0.3em",
            marginTop: "6px",
          }}
        >
          GITHUB REPOSITORY GACHA
        </motion.p>
      </header>

      <LanguageSelector selected={language} onSelect={setLanguage} />

      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "2px",
          padding: "8px 16px 0",
          borderBottom: "1px solid #1a1a2e",
          maxWidth: "500px",
          margin: "0 auto",
        }}
      >
        {(Object.entries(TAB_LABELS) as [Tab, { label: string; icon: string }][]).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`nav-tab ${tab === key ? "active" : ""}`}
          >
            <span style={{ marginRight: "6px", fontSize: "13px" }}>{val.icon}</span>
            {val.label}
          </button>
        ))}
      </nav>

      <main style={{ maxWidth: "640px", margin: "0 auto", padding: "20px 16px" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            {tab === "gacha" && <GachaMachine language={language} />}
            {tab === "history" && <PullHistory />}
            {tab === "favorites" && <Favorites />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;