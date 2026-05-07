export type Rarity = "N" | "R" | "SR" | "UR";

export interface RarityConfig {
  rarity: Rarity;
  label: string;
  starsMin: number;
  starsMax: number;
  probability: number;
  color: string;
  glowColor: string;
}

export const RARITY_CONFIGS: RarityConfig[] = [
  { rarity: "N", label: "Common", starsMin: 0, starsMax: 100, probability: 0.5, color: "#9ca3af", glowColor: "#6b7280" },
  { rarity: "R", label: "Rare", starsMin: 100, starsMax: 1000, probability: 0.3, color: "#3b82f6", glowColor: "#60a5fa" },
  { rarity: "SR", label: "Super Rare", starsMin: 1000, starsMax: 10000, probability: 0.15, color: "#8b5cf6", glowColor: "#a78bfa" },
  { rarity: "UR", label: "Ultra Rare", starsMin: 10000, starsMax: Infinity, probability: 0.05, color: "#f59e0b", glowColor: "#fbbf24" },
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
  { name: "TypeScript", icon: "🔷", color: "#3178c6" },
  { name: "JavaScript", icon: "🟨", color: "#f7df1e" },
  { name: "Python", icon: "🐍", color: "#3776ab" },
  { name: "Rust", icon: "🦀", color: "#dea584" },
  { name: "Go", icon: "🔵", color: "#00add8" },
  { name: "Ruby", icon: "💎", color: "#cc342d" },
  { name: "Java", icon: "☕", color: "#b07219" },
  { name: "Kotlin", icon: "🟣", color: "#7f52ff" },
  { name: "Swift", icon: "🐦", color: "#f05138" },
  { name: "C", icon: "⚙️", color: "#555555" },
  { name: "C++", icon: "⚡", color: "#f34b7d" },
  { name: "C#", icon: "🎯", color: "#178600" },
  { name: "PHP", icon: "🐘", color: "#777bb4" },
  { name: "Scala", icon: "🔥", color: "#dc322f" },
  { name: "Dart", icon: "🎯", color: "#00b4ab" },
  { name: "Lua", icon: "🌙", color: "#000080" },
  { name: "Zig", icon: "⚡", color: "#ec915c" },
  { name: "Elixir", icon: "💜", color: "#4e2a8e" },
  { name: "Haskell", icon: "λ", color: "#5e5086" },
  { name: "OCaml", icon: "🐫", color: "#ef7a08" },
];