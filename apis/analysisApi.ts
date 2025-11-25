// src/apis/analysisApi.ts
import { api } from "./instance";

export const analysisApi = {
  getAnalysis: (userId: number, date: string) =>
    api.get(`/diary/analyze/${userId}/${date}`),
};
