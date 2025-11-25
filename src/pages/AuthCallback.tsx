import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const params = new URLSearchParams(window.location.search);
      const accessToken = params.get("accessToken");
      const code = params.get("code");

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        navigate("/home");
        return;
      }

      if (code) {
        // 백엔드가 이 엔드포인트에서 JSON을 반환하면 여기서 호출해서 토큰을 받아올 수 있습니다.
        try {
          const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/kakao/callback?code=${encodeURIComponent(
            code
          )}`, { credentials: "include" });
          const data = await resp.json();
          if (data?.accessToken) {
            localStorage.setItem("accessToken", data.accessToken);
            navigate("/home");
            return;
          }
        } catch (e) {
          console.error("콜백 처리 중 에러", e);
        }
      }

      // 실패 시 루트로 이동
      navigate("/");
    })();
  }, [navigate]);

  return <div className="w-full h-screen flex items-center justify-center">로그인 처리 중...</div>;
}
