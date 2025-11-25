// src/apis/homeApi.ts
import { api } from "./instance";

export const homeApi = {
  getHome: (userId: number, today: string) =>
    api.get(`/home/${userId}/${today}`),
};
