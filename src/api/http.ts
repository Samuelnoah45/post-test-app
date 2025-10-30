import axios, { AxiosError } from "axios";

export const http = axios.create({
  baseURL: "/api",
  timeout: 15000,
  withCredentials: false,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      if (error.response.status === 401) {
      }
    }
    return Promise.reject(error);
  },
);

export default http;
