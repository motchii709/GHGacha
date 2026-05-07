import type { GitHubRepo, RepoDetail, Rarity } from "../types";

const API_BASE = "/api";

export async function searchRepo(language: string, rarity: Rarity): Promise<{ repo: GitHubRepo; rarity: Rarity }> {
  const res = await fetch(`${API_BASE}/search?language=${encodeURIComponent(language)}&rarity=${rarity}`);
  if (!res.ok) {
    throw new Error(`Search failed: ${res.status}`);
  }
  return res.json();
}

export async function fetchRepoDetail(owner: string, name: string): Promise<RepoDetail> {
  const res = await fetch(`${API_BASE}/repo/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`);
  if (!res.ok) {
    throw new Error(`Repo fetch failed: ${res.status}`);
  }
  return res.json();
}

export async function fetchLanguages(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/languages`);
  if (!res.ok) {
    throw new Error(`Languages fetch failed: ${res.status}`);
  }
  return res.json();
}