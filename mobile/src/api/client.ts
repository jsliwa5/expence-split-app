import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import Constants from "expo-constants";
import { Platform } from "react-native";

// ── Determine API base URL ──────────────────────────
// When running on Expo Go (physical device via QR), we extract the dev machine's IP
// from Expo's manifest so the device can reach the backend.
// For emulators, we use the standard loopback addresses.
function getBaseURL(): string {
  // Return the production Render URL
  return "https://expence-split-app.onrender.com";
}

const client = axios.create({
  baseURL: getBaseURL(),
  headers: { "Content-Type": "application/json" },
});

// ── Request interceptor: attach JWT ──────────────────
client.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: handle 401 ─────────────────
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("token");
      router.replace("/(auth)/login");
    }
    return Promise.reject(error);
  },
);

export default client;
