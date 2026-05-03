import Constants from "expo-constants";

/**
 * Centralised API configuration.
 *
 * The base URL is derived from Expo's Metro hostUri so it always
 * points to the correct machine regardless of which network you're on.
 * Never hardcode an IP here — let it auto-detect.
 */
const getBaseUrl = (): string => {
  const hostUri = Constants.expoConfig?.hostUri?.split(":")?.[0];
  if (hostUri) return `http://${hostUri}:5001/api`;
  return "http://localhost:5001/api";
};

export const API_BASE_URL = getBaseUrl();

export const ENDPOINTS = {
  payments: `${API_BASE_URL}/payments`,
  health: `${API_BASE_URL}/health`,
} as const;
