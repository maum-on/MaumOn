// src/apis/authApi.ts
import { api } from "./instance";

export const authApi = {
  // 🔥 카카오 로그인 (필요하면 유지)
  kakaoLogin: () => api.post("/auth/kakao/login"),

  // 🔥 카카오 로그아웃 (명세서 기준)
  logout: () => {
    const token = localStorage.getItem("accessToken");
    const kakaoToken = localStorage.getItem("kakaoAccessToken") || "";

    return api.post(
      "/auth/kakao/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Kakao-Access-Token": kakaoToken,
        },
        withCredentials: true,
      }
    );
  },

  // 🔥 회원탈퇴 API (기존 내용 유지)
  withdraw: () => api.delete("/auth/kakao/withdraw"),
};
