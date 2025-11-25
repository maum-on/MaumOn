// src/pages/Splash2.tsx
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import kakaoBtn from "../assets/kakao_login_btn.png";

export default function Splash2() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // ⭐ 임시: 로그인 생략하고 바로 홈화면으로 이동
    navigate("/home");
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-[#FAFAF0] gap-10">
      <img src={logo} className="w-40 opacity-90" />

      <button onClick={handleLogin}>
        <img src={kakaoBtn} className="w-56" />
      </button>
    </div>
  );
}
