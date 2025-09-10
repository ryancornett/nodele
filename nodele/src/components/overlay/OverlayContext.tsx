import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type PanelId = "howto" | "settings" | "info" | "results" | "nomoremoves";

type OverlayState<T = any> = { id: PanelId; data?: T } | null;

type OverlayCtx = {
  open: <T = any>(id: PanelId, data?: T) => void;
  close: () => void;
  state: OverlayState | null;
};

const Ctx = createContext<OverlayCtx | null>(null);

export function OverlayProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<OverlayState | null>(null);

  const open = useCallback(<T,>(id: PanelId, data?: T) => setState({ id, data }), []);
  const close = useCallback(() => setState(null), []);

  // lock body scroll while open
  useEffect(() => {
    if (state) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [state]);

  const value = useMemo(() => ({ open, close, state }), [open, close, state]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useOverlay() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useOverlay must be used within OverlayProvider");
  return ctx;
}
