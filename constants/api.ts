// ─────────────────────────────────────────────────────────────
//  API Configuration
//  👉 Change ONLY this file when running on a different machine.
//     Set BASE_URL to your PC's LAN IP + the backend port.
//     Example: 'http://192.168.1.105:5000'
// ─────────────────────────────────────────────────────────────

export const BASE_URL = 'http://192.168.2.96:5000';

export const API = {
  login:    `${BASE_URL}/api/auth/login`,
  register: `${BASE_URL}/api/auth/register`,
  auth:     `${BASE_URL}/api/auth`,
  serviceHistory: `${BASE_URL}/api/services/my-history`,
  addService: `${BASE_URL}/api/services/add`,
} as const;
