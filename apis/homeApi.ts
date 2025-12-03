// src/apis/homeApi.ts
import { api } from "./instance";

export const homeApi = {
  getHomeData: (userId: string, today: string) =>
    api.get(`/home/${userId}/${today}`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }),

  // 🎧 오늘의 라디오 (AI 응원 메시지)
  getBoostMessage: (userId: string, date: string) =>
    api.get(`/home/boost/${userId}/${date}`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }),
};
