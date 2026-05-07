import { useState, useCallback, useEffect } from "react";
import type { GachaResult } from "../types";

const STORAGE_KEY = "ghgacha_favorites";

function loadFavorites(): GachaResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<GachaResult[]>(loadFavorites);

  useEffect(() => {
    const onStorage = () => setFavorites(loadFavorites());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggleFavorite = useCallback((item: GachaResult) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.repo.id === item.repo.id);
      const next = exists
        ? prev.filter((f) => f.repo.id !== item.repo.id)
        : [item, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (repoId: number) => favorites.some((f) => f.repo.id === repoId),
    [favorites]
  );

  return { favorites, toggleFavorite, isFavorite };
}