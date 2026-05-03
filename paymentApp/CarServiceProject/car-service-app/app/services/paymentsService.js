import axios from "axios";
import Constants from "expo-constants";

// Auto-detect the server IP from Expo's Metro host (always correct regardless of network).
// Falls back to localhost for web/simulator.
const getApiUrl = () => {
  const hostUri = Constants.expoConfig?.hostUri?.split(":")?.[0];
  if (hostUri) return `http://${hostUri}:5001/api`;
  return "http://localhost:5001/api";
};

const API_BASE_URL = getApiUrl();

const API = axios.create({
  baseURL: `${API_BASE_URL}/payments`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 8000, // 8 seconds — fail fast and show a clear error
});

// Request interceptor — log outgoing requests in dev
API.interceptors.request.use((config) => {
  console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  return config;
});

// Response interceptor — normalise network errors into readable messages
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      error.friendlyMessage =
        "Cannot reach the server. Make sure the backend is running and your phone is on the same Wi-Fi/hotspot as your computer.";
    } else if (!error.response) {
      error.friendlyMessage =
        "Network error: Cannot connect to the server. Check that the backend is running.";
    } else {
      error.friendlyMessage =
        error.response?.data?.message || "An unexpected error occurred.";
    }
    return Promise.reject(error);
  }
);

export const createPayment = (data) => API.post("/", data);
export const getAllPayments = (params = {}) => API.get("/", { params });
export const getPaymentById = (id) => API.get(`/${id}`);
export const updatePaymentStatus = (id, status) => API.patch(`/${id}/status`, { status });
export const deletePayment = (id) => API.delete(`/${id}`);

export default API;