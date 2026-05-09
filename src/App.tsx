import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LanguageSelector } from "./components/LanguageSelector";
import { GachaMachine } from "./components/GachaMachine";
import { PullHistory } from "./components/PullHistory";
import { Favorites } from "./components/Favorites";
import "./styles/index.css";
import "./styles/gacha.css";

type Tab = "gacha" | "history" | "favorites";

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "gacha", label: "GACHA", icon: "✦" },
  { key: "history", label: "HISTORY", icon: "📋" },
  { key: "favorites", label: "FAVORITES", icon: "★" },
];

function App() {
  const [language, setLanguage] = useState("TypeScript");
  const [tab, setTab] = useState<Tab>("gacha");

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: 32 }}>
      <div style={{ padding: "28px 20px 12px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 400, letterSpacing: "0.12em", color: "var(--text)" }}>
          GHGACHA
        </h1>
        <p style={{ fontFamily: "var(--font-display)", fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.25em", marginTop: 4 }}>
          GITHUB REPOSITORY GACHA
        </p>
      </div>

      <LanguageSelector selected={language} onSelect={setLanguage} />

      <div style={{ display: "flex", justifyContent: "center", gap: 2, padding: "4px 20px 0", borderBottom: "1px solid #eeeef4", margin: "0 20px" }}>
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`nav-btn ${tab === t.key ? "active" : ""}`}>
            <span style={{ marginRight: 4 }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      <main style={{ padding: "20px 20px" }}>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
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