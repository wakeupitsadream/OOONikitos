declare global {
  interface Window {
    /** Яндекс.Метрика: window.ym(id, 'hit' | 'reachGoal', ...) */
    ym?: (id: number, action: string, ...args: unknown[]) => void;
  }
}

export {};
