import axios from "axios";

// ✅ Ganti localhost dengan domain Railway
const API_BASE_URL = "https://deploy-be-production-c297.up.railway.app/api/";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
