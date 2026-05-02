// ─────────────────────────────────────────────────────────────
//  API Configuration
//  👉 For Production: Set EXPO_PUBLIC_BASE_URL in your Vercel settings.
//     For Local: It defaults to your current LAN IP.
// ─────────────────────────────────────────────────────────────

const DEFAULT_LOCAL_URL = 'http://192.168.1.101:5000';

export const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || DEFAULT_LOCAL_URL;

export const API = {
  login:    `${BASE_URL}/api/auth/login`,
  register: `${BASE_URL}/api/auth/register`,
  auth:     `${BASE_URL}/api/auth`,
  services: `${BASE_URL}/api/services`,
  mechanics: `${BASE_URL}/api/mechanics`,
} as const;

export const BOOKINGS_URL = `${BASE_URL}/api/bookings`;