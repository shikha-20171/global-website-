"use client";
import { createContext, useContext, useState, useCallback } from "react";

const Ctx = createContext(null);
export const useCompare = () => useContext(Ctx);
export const MAX_COMPARE = 3;

export function CompareProvider({ children }) {
  const [ids, setIds] = useState([]);
  const toggle = useCallback((slug) => setIds((c) => (c.includes(slug) ? c.filter((x) => x !== slug) : c.length >= MAX_COMPARE ? c : [...c, slug])), []);
  const clear = useCallback(() => setIds([]), []);
  return <Ctx.Provider value={{ ids, toggle, clear }}>{children}</Ctx.Provider>;
}
