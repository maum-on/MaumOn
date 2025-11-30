// src/pages/Splash2.tsx
import kakaoBtn from "../assets/kakao_login_btn.svg";
import logo from "../assets/logo.svg";

export default function Splash2() {
  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/kakao/login`;
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
