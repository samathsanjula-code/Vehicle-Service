import axios from "axios";
import Constants from "expo-constants";

const envUrl = process.env.EXPO_PUBLIC_API_URL;
const hostUri = Constants.expoConfig?.hostUri?.split(":")?.[0];

const fallbackUrl = hostUri ? `http://${hostUri}:5001/api` : "http://localhost:5001/api";

const API_BASE_URL = envUrl || fallbackUrl;

const API = axios.create({
  baseURL: `${API_BASE_URL}/payments`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

export const createPayment = (data) => API.post("/", data);
export const getAllPayments = (params = {}) => API.get("/", { params });
export const getPaymentById = (id) => API.get(`/${id}`);
export const updatePaymentStatus = (id, status) => API.patch(`/${id}/status`, { status });
export const deletePayment = (id) => API.delete(`/${id}`);

export default API;