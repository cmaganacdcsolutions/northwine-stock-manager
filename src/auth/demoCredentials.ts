/**
 * DEMO-ONLY credentials.
 *
 * This app has no backend — authentication is a client-side gate for the
 * North Wine demo walkthrough. Never reuse this pattern for a real login.
 */
export const DEMO_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
} as const;

export function verifyDemoCredentials(username: string, password: string): boolean {
  return username === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password;
}
