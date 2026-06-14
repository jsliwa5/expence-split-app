import client from './client';
import type { RegisterRequest, LoginRequest, AuthResponse } from '../types';

export async function register(data: RegisterRequest): Promise<string> {
  const response = await client.post<string>('/api/auth/register', data);
  return response.data;
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await client.post<AuthResponse>('/api/auth/login', data);
  return response.data;
}
