// ─────────────────────────────────────────────────────────────
//  API Configuration
//  👉 Change ONLY this file when running on a different machine.
//     Set BASE_URL to your PC's LAN IP + the backend port.
//     Example: 'http://192.168.1.105:5000'
// ─────────────────────────────────────────────────────────────

export const BASE_URL = 'http://192.168.1.61:5000';

export const API = {
  login:    `${BASE_URL}/api/auth/login`,
  register: `${BASE_URL}/api/auth/register`,
  auth:     `${BASE_URL}/api/auth`,
  services: `${BASE_URL}/api/services`,
  mechanics: `${BASE_URL}/api/mechanics`,
} as const;

export const BOOKINGS_URL = `${BASE_URL}/api/bookings`;