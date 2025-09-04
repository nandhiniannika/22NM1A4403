import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useSyncExternalStore,
} from "react";

const LOG_KEY = "app_logs";

// Factory function that creates a log store
function createLogStore() {
  // Load logs from localStorage, or start fresh
  let logs = [];
  try {
    const saved = localStorage.getItem(LOG_KEY);
    if (saved) logs = JSON.parse(saved);
  } catch {
    logs = [];
  }

  const listeners = new Set();

  // Save logs + notify all subscribers
  function notify() {
    try {
      localStorage.setItem(LOG_KEY, JSON.stringify(logs));
    } catch {
      // if storage is full or disabled, just skip
    }
    listeners.forEach((fn) => fn());
  }

  // Append a new entry to the log
  function addLog(level, msg, meta) {
    const entry = {
      id: crypto.randomUUID(),
      time: new Date().toLocaleTimeString(),
      level,
      msg,
      meta: meta || null,
    };
    logs = [entry, ...logs].slice(0, 500); // keep most recent 500
    notify();
  }

  // Clear all logs
  function resetLogs() {
    logs = [];
    notify();
  }

  return {
    get: () => logs,
    subscribe: (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    addLog,
    resetLogs,
  };
}

const LoggerContext = createContext(null);

export function LoggerProvider({ children }) {
  const ref = useRef(null);
  if (!ref.current) ref.current = createLogStore();

  const api = useMemo(() => {
    const store = ref.current;
    return {
      useLogs: () =>
        useSyncExternalStore(store.subscribe, store.get, store.get),
      info: (msg, meta) => store.addLog("info", msg, meta),
      warn: (msg, meta) => store.addLog("warn", msg, meta),
      error: (msg, meta) => store.addLog("error", msg, meta),
      clear: store.resetLogs,
    };
  }, []);

  return (
    <LoggerContext.Provider value={api}>{children}</LoggerContext.Provider>
  );
}

export function useLogger() {
  const ctx = useContext(LoggerContext);
  if (!ctx) {
    throw new Error("useLogger must be used inside a <LoggerProvider>");
  }
  return ctx;
}
