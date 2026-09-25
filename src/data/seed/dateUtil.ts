/** Returns an ISO date `offsetDays` from today (negative = past, positive = future). */
export function isoOffset(offsetDays: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}
