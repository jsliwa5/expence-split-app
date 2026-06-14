import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// ── Determine API base URL ──────────────────────────
// When running on Expo Go (physical device via QR), we extract the dev machine's IP
// from Expo's manifest so the device can reach the backend.
// For emulators, we use the standard loopback addresses.
function getBaseURL(): string {
  // Try to extract dev machine IP from Expo's debuggerHost (works in Expo Go)
  const debuggerHost =
    Constants.expoConfig?.hostUri ??
    Constants.manifest2?.extra?.expoGo?.debuggerHost ??
    Constants.manifest?.debuggerHost;

  if (debuggerHost) {
    const host = debuggerHost.split(':')[0]; // strip port
    return `http://${host}:8080`;
  }

  // Fallback for emulators
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8080';
  }
  return 'http://localhost:8080';
}

const client = axios.create({
  baseURL: getBaseURL(),
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: attach JWT ──────────────────
client.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
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
      await AsyncStorage.removeItem('token');
      router.replace('/(auth)/login');
    }
    return Promise.reject(error);
  },
);

export default client;
