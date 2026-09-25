/** Generates a demo-friendly unique id (not cryptographically secure). */
export function generateId(prefix: string): string {
  const random = Math.random().toString(36).slice(2, 9);
  const timestamp = Date.now().toString(36).slice(-4);
  return `${prefix}_${timestamp}${random}`;
}
