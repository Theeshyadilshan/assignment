/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import useAuthStore from '../hooks/useAuthStore';
const BASE_URL='http://localhost:5000'
const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config:any) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response:any) => response,
  async (error:any) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.get(BASE_URL+'/refresh-token', {
          withCredentials: true,
        });

        const { accessToken, user } = response.data;

        useAuthStore.getState().setAccessToken(accessToken);
        useAuthStore.getState().setUserData({ email: user.email, name: user.name });

        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
