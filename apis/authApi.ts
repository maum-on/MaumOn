// src/apis/authApi.ts
import { api } from "./instance";

export const authApi = {
  kakaoLogin: () => api.post("/auth/kakao/login"),
  logout: () => api.post("/auth/kakao/logout"),
  withdraw: () => api.delete("/auth/kakao/withdraw"),
};
