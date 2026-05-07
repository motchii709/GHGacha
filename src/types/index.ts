export type Rarity = "N" | "R" | "SR" | "UR";

export interface RarityConfig {
  rarity: Rarity;
  label: string;
  labelJp: string;
  starsMin: number;
  starsMax: number;
  probability: number;
  color: string;
  glowCss: string;
  cssClass: string;
}

export const RARITY_CONFIGS: RarityConfig[] = [
  {
    rarity: "N", label: "COMMON", labelJp: "ノーマル",
    starsMin: 0, starsMax: 100, probability: 0.5,
    color: "#8a8a9a", glowCss: "var(--glow-n)", cssClass: "rarity-glow-N",
  },
  {
    rarity: "R", label: "RARE", labelJp: "レア",
    starsMin: 100, starsMax: 1000, probability: 0.3,
    color: "#4d9eff", glowCss: "var(--glow-r)", cssClass: "rarity-glow-R",
  },
  {
    rarity: "SR", label: "SUPER RARE", labelJp: "スーパーレア",
    starsMin: 1000, starsMax: 10000, probability: 0.15,
    color: "#b44dff", glowCss: "var(--glow-sr)", cssClass: "rarity-glow-SR",
  },
  {
    rarity: "UR", label: "ULTRA RARE", labelJp: "ウルトラレア",
    starsMin: 10000, starsMax: Infinity, probability: 0.05,
    color: "#ffd700", glowCss: "var(--glow-ur)", cssClass: "rarity-glow-UR",
  },
];

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  language: string | null;
  topics: string[];
  license: {
    spdx_id: string;
  } | null;
  updated_at: string;
}

export interface RepoDetail extends GitHubRepo {
  readme: string | null;
}

export interface GachaResult {
  repo: GitHubRepo;
  rarity: Rarity;
  timestamp: number;
}

export interface Language {
  name: string;
  icon: string;
  color: string;
}

export const LANGUAGES: Language[] = [
  { name: "TypeScript", icon: "TS", color: "#3178c6" },
  { name: "JavaScript", icon: "JS", color: "#f7df1e" },
  { name: "Python", icon: "Py", color: "#3776ab" },
  { name: "Rust", icon: "Rs", color: "#dea584" },
  { name: "Go", icon: "Go", color: "#00add8" },
  { name: "Ruby", icon: "Rb", color: "#cc342d" },
  { name: "Java", icon: "Jv", color: "#b07219" },
  { name: "Kotlin", icon: "Kt", color: "#7f52ff" },
  { name: "Swift", icon: "Sw", color: "#f05138" },
  { name: "C", icon: "C", color: "#555555" },
  { name: "C++", icon: "C+", color: "#f34b7d" },
  { name: "C#", icon: "C#", color: "#178600" },
  { name: "PHP", icon: "PH", color: "#777bb4" },
  { name: "Scala", icon: "Sc", color: "#dc322f" },
  { name: "Dart", icon: "Da", color: "#00b4ab" },
  { name: "Lua", icon: "Lu", color: "#000080" },
  { name: "Zig", icon: "Zi", color: "#ec915c" },
  { name: "Elixir", icon: "Ex", color: "#4e2a8e" },
  { name: "Haskell", icon: "Hs", color: "#5e5086" },
  { name: "OCaml", icon: "OC", color: "#ef7a08" },
];