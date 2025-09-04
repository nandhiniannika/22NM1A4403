import React, { createContext, useContext, useMemo, useRef, useSyncExternalStore } from "react";

const LOG_KEY = "app_logs";

function createStore() {
  let logs = [];
  try {
    const saved = localStorage.getItem(LOG_KEY);
    if (saved) logs = JSON.parse(saved);
  } catch {}

  const listeners = new Set();

  function notify() {
    try {
      localStorage.setItem(LOG_KEY, JSON.stringify(logs));
    } catch {}
    listeners.forEach((fn) => fn());
  }

  return {
    get: () => logs,
    subscribe: (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    push: (level, msg, meta) => {
      const entry = {
        id: crypto.randomUUID(),
        time: new Date().toLocaleTimeString(),
        level,
        msg,
        meta: meta || null,
      };
      logs = [entry, ...logs].slice(0, 500);
      notify();
    },
    clear: () => {
      logs = [];
      notify();
    },
  };
}

const LoggerContext = createContext(null);

export function LoggerProvider({ children }) {
  const ref = useRef(null);
  if (!ref.current) ref.current = createStore();

  const api = useMemo(() => {
    const store = ref.current;
    return {
      useLogs: () => useSyncExternalStore(store.subscribe, store.get, store.get),
      info: (msg, meta) => store.push("info", msg, meta),
      warn: (msg, meta) => store.push("warn", msg, meta),
      error: (msg, meta) => store.push("error", msg, meta),
      clear: store.clear,
    };
  }, []);

  return <LoggerContext.Provider value={api}>{children}</LoggerContext.Provider>;
}

export function useLogger() {
  const ctx = useContext(LoggerContext);
  if (!ctx) throw new Error("useLogger must be used inside LoggerProvider");
  return ctx;
}
