// src/apis/instance.ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwia2FrYW9JZCI6NDU0MTI0MjQ2OSwiaWF0IjoxNzYyOTE3OTI2LCJleHAiOjE3NjI5MTk3MjZ9.6FbNiDvROwUi0F8cSWT9DfP8ipl9SgE9mfK59Qg3MBoIT3NVy-OpjUmgMKqRWyajhz9Ph4nN10i1hFHrqfY3oQ");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);