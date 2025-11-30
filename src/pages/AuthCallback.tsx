// src/pages/AuthCallback.tsx
import { useEffect } from "react";
import axios from "axios";
import { api } from "../../apis/instance";  // ⭐ api 인스턴스 불러오기

export default function AuthCallback() {
  useEffect(() => {
    const getToken = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (!code) {
          alert("인가 코드가 없습니다.");
          window.location.href = "/";
          return;
        }

        // ⭐ 백엔드 카카오 콜백 요청
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/auth/kakao/callback?code=${code}`,
          { withCredentials: true }
        );

        console.log("백엔드 응답:", res.data);

        const token = res.data?.accessToken;
        const userId = res.data?.userId;

        if (!token || !userId) {
          alert("로그인 정보가 올바르지 않습니다.");
          window.location.href = "/";
          return;
        }

        // ⭐ accessToken + userId 저장
        localStorage.setItem("accessToken", token);
        localStorage.setItem("userId", String(userId));

        // ================================
        // 🔥 여기가 핵심!! (2곳 모두 갱신)
        // ================================
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`; // ⭐ 추가해야 403 사라짐
        // ================================

        // ⭐ 콜백 재실행 방지용 리다이렉트
        window.location.href = "/home";

      } catch (err) {
        console.error("카카오 로그인 오류:", err);
        alert("로그인 처리 중 오류가 발생했습니다.");
        window.location.href = "/";
      }
    };

    getToken();
  }, []);

  return <div style={{ padding: 20 }}>로그인 중...</div>;
}
