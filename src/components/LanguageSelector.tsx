import { LANGUAGES } from "../types";

interface Props {
  selected: string;
  onSelect: (language: string) => void;
}

export function LanguageSelector({ selected, onSelect }: Props) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", padding: "16px" }}>
      {LANGUAGES.map((lang) => (
        <button
          key={lang.name}
          onClick={() => onSelect(lang.name)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "10px 16px",
            border: selected === lang.name ? `2px solid ${lang.color}` : "2px solid transparent",
            borderRadius: "12px",
            background: selected === lang.name ? `${lang.color}22` : "#1a1a2e",
            color: selected === lang.name ? lang.color : "#a0a0b8",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: selected === lang.name ? 700 : 400,
            transition: "all 0.2s",
          }}
        >
          <span style={{ fontSize: "18px" }}>{lang.icon}</span>
          {lang.name}
        </button>
      ))}
    </div>
  );
}