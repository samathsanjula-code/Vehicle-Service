// ─────────────────────────────────────────────────────────────
//  API Configuration
//  👉 Change ONLY this file when running on a different machine.
//     Set BASE_URL to your PC's LAN IP + the backend port.
//     Example: 'http://192.168.1.105:5000'
// ─────────────────────────────────────────────────────────────

export const BASE_URL = 'http://172.16.102.32:5000';

export const API = {
  login: `${BASE_URL}/api/auth/login`,
  register: `${BASE_URL}/api/auth/register`,
  auth: `${BASE_URL}/api/auth`,
  vehicleService: `${BASE_URL}/api/vehicle-service`,
  vehicles: `${BASE_URL}/api/vehicles`,
  adminVehicles: `${BASE_URL}/api/vehicles/admin/all`,
} as const;
