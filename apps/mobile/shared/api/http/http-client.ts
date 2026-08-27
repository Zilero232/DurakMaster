import axios from 'axios';

import { API_URL } from '@/shared/config';

import { getAuthToken } from '../auth/auth-client';

export const httpClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 20_000
});

httpClient.interceptors.request.use(async (config) => {
  const token = await getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
