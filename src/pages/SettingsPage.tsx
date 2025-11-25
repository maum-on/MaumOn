// src/pages/SettingsPage.tsx
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-[#FDFFF9] px-6 pt-8 pb-20 max-w-md mx-auto">

      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="text-xl">←</button>
        <p className="text-[18px] font-semibold text-[#2F2F2F]">설정</p>
        <div className="w-6" /> {/* 오른쪽 자리 맞추기용 */}
      </div>

      {/* 설정 영역 */}
      <div className="space-y-6">

        {/* 계정 정보 */}
        <section className="bg-white rounded-2xl shadow-md p-6">
          <p className="text-gray-800 font-semibold mb-4">계정</p>

          <button className="w-full text-left py-3 border-b border-gray-100 text-gray-700">
            프로필 수정
          </button>

          <button className="w-full text-left py-3 text-gray-700">
            비밀번호 변경
          </button>
        </section>

        {/* 앱 설정 */}
        <section className="bg-white rounded-2xl shadow-md p-6">
          <p className="text-gray-800 font-semibold mb-4">앱 설정</p>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="text-gray-700">알림 설정</span>
            <input type="checkbox" className="accent-[#A8C686] w-5 h-5" />
          </div>

          <div className="flex items-center justify-between py-3">
            <span className="text-gray-700">다크모드</span>
            <input type="checkbox" className="accent-[#A8C686] w-5 h-5" />
          </div>
        </section>

        {/* 정보 */}
        <section className="bg-white rounded-2xl shadow-md p-6">
          <p className="text-gray-800 font-semibold mb-4">정보</p>

          <button className="w-full text-left py-3 border-b border-gray-100 text-gray-700">
            이용약관
          </button>

          <button className="w-full text-left py-3 border-b border-gray-100 text-gray-700">
            개인정보 처리방침
          </button>

          <button className="w-full text-left py-3 text-gray-700">
            앱 버전 1.0.0
          </button>
        </section>

        {/* 로그아웃 */}
        <button
          onClick={() => alert("로그아웃되었습니다.")}
          className="w-full text-red-500 font-semibold py-4 bg-white rounded-2xl shadow"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}
