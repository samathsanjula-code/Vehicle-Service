import axios from "axios";
import { API_BASE_URL } from "../../constants/api";

const API = axios.create({
  baseURL: `${API_BASE_URL}/payments`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 8000,
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