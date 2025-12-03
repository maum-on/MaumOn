// src/apis/diaryApi.ts
import { api } from "./instance";

export const diaryApi = {
  // ✏️ 일기 작성
  writeDiary: (userId: number, date: string, formData: FormData) =>
    api.post(`/write/${userId}/${date.replace(/-/g, ".")}`, formData),

  // 🎤 음성 → 텍스트 변환 (STT)
  sttDiary: (userId: number, date: string, formData: FormData) =>
    api.post(`/stt/${userId}/${date.replace(/-/g, ".")}`, formData),

  // 📄 파일 등록
  uploadFile: (userId: number, date: string, formData: FormData) =>
    api.post(`/files/${userId}/${date.replace(/-/g, ".")}`, formData),

  // 🎨 그림 일기 등록
  uploadDrawing: (userId: number, date: string, formData: FormData) =>
    api.post(`/draw/${userId}/${date.replace(/-/g, ".")}`, formData),

  // 🧠 일기 분석 조회 🔥🔥🔥
  analyzeDiary: (userId: number, date: string) =>
    api.get(`/diary/analyze/${userId}/${date.replace(/-/g, ".")}`),

  // 🎯 마이페이지 조회
  mypage: (userId: number) => api.get(`/mypage/${userId}`),
};
