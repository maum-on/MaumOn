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
};
