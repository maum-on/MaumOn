// src/apis/diaryApi.ts
import { api } from "./instance";

export const diaryApi = {
  writeDiary: (userId: number, date: string, data: any) =>
    api.post(`/write/${userId}/${date}`, data),

  uploadFile: (userId: number, date: string, file: FormData) =>
    api.post(`/files/${userId}/${date}`, file, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  uploadDrawing: (userId: number, date: string, file: FormData) =>
    api.post(`/draw/${userId}/${date}`, file, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};
