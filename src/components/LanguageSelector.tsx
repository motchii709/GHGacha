import { motion } from "framer-motion";
import { LANGUAGES } from "../types";

interface Props {
  selected: string;
  onSelect: (lang: string) => void;
}

export function LanguageSelector({ selected, onSelect }: Props) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, justifyContent: "center", padding: "8px 16px 4px" }}>
      {LANGUAGES.map((lang, i) => (
        <motion.button
          key={lang.name}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.02, duration: 0.2 }}
          onClick={() => onSelect(lang.name)}
          className={`lang-chip ${selected === lang.name ? "active" : ""}`}
          style={{ color: selected === lang.name ? lang.color : undefined, borderColor: selected === lang.name ? `${lang.color}55` : undefined }}
        >
          <span style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 20, height: 20, borderRadius: 5, background: `${lang.color}18`,
            color: lang.color, fontSize: 9, fontWeight: 700, fontFamily: "var(--font-display)",
          }}>
            {lang.icon}
          </span>
          {lang.name}
        </motion.button>
      ))}
    </div>
  );
}