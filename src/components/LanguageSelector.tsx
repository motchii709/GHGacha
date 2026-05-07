import { motion } from "framer-motion";
import { LANGUAGES } from "../types";

interface Props {
  selected: string;
  onSelect: (language: string) => void;
}

export function LanguageSelector({ selected, onSelect }: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "6px",
        justifyContent: "center",
        padding: "12px 16px 8px",
        maxWidth: "720px",
        margin: "0 auto",
      }}
    >
      {LANGUAGES.map((lang, i) => (
        <motion.button
          key={lang.name}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03, duration: 0.3 }}
          onClick={() => onSelect(lang.name)}
          className={`language-chip ${selected === lang.name ? "active" : ""}`}
          style={{
            color: selected === lang.name ? lang.color : undefined,
            borderColor: selected === lang.name ? `${lang.color}66` : undefined,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "24px",
              height: "24px",
              borderRadius: "6px",
              background: `${lang.color}22`,
              color: lang.color,
              fontSize: "10px",
              fontWeight: 700,
              fontFamily: "var(--font-display)",
            }}
          >
            {lang.icon}
          </span>
          {lang.name}
        </motion.button>
      ))}
    </div>
  );
}