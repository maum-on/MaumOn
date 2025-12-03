// src/apis/authApi.ts
import { api } from "./instance";

export const authApi = {
  // 카카오 로그인 
  kakaoLogin: () => api.post("/auth/kakao/login"),

  // 카카오 로그아웃 
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

  // 회원탈퇴 API 
withdraw: () =>
    api.post("/auth/kakao/withdraw", null, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Kakao-Access-Token": localStorage.getItem("kakaoAccessToken") || "",
      },
    }),
  }

