import { useState, useCallback, useEffect } from "react";
import type { GachaResult } from "../types";

const STORAGE_KEY = "ghgacha_history";
const MAX_ITEMS = 50;

function loadHistory(): GachaResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useHistory() {
  const [history, setHistory] = useState<GachaResult[]>(loadHistory);

  useEffect(() => {
    const onStorage = () => setHistory(loadHistory());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addToHistory = useCallback((item: GachaResult) => {
    setHistory((prev) => {
      const next = [item, ...prev].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  }, []);

  return { history, addToHistory, clearHistory };
}