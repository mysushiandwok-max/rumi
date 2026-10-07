export type Trend = { direction: "up" | "down" | "flat" | "new"; percent: number };

export function computeTrend(current: number, previous: number): Trend {
  if (previous === 0) {
    return current > 0 ? { direction: "new", percent: 0 } : { direction: "flat", percent: 0 };
  }
  const change = ((current - previous) / previous) * 100;
  if (Math.abs(change) < 1) return { direction: "flat", percent: 0 };
  return { direction: change > 0 ? "up" : "down", percent: Math.round(Math.abs(change)) };
}
