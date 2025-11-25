import { useNavigate } from "react-router-dom";
import turtle from "../assets/turtle.png";

export default function MyPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-[#FDFFF9] pt-10 pb-20 px-6 max-w-md mx-auto">

      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="text-xl">←</button>
        <p className="text-[18px] font-semibold text-[#2F2F2F]">마이페이지</p>
        <div className="w-6" />
      </div>

      {/* 프로필 카드 */}
      <section className="bg-[#E8F4E8] rounded-3xl p-6 shadow-inner mb-8">
        <div className="flex items-center gap-4">
          <img src={turtle} className="w-16" />
          <div>
            <p className="text-[17px] font-semibold text-[#1F3A1D]">
              거북이님 안녕하세요 :)
            </p>
            <p className="text-sm text-gray-600">turtle@example.com</p>
          </div>
        </div>
      </section>

      {/* 활동 정보 */}
      <section className="space-y-4 mb-10">
        <p className="text-[16px] font-semibold text-gray-700">나의 활동</p>

        <div className="bg-white rounded-2xl p-5 shadow-sm flex justify-between">
          <span className="text-gray-700">이번달 일기 수</span>
          <span className="font-semibold text-[#4CAF50]">12개</span>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm flex justify-between">
          <span className="text-gray-700">이번달 마음 온도 평균</span>
          <span className="font-semibold text-[#4CAF50]">32°C</span>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm flex justify-between">
          <span className="text-gray-700">그림 일기</span>
          <span className="font-semibold text-[#4CAF50]">5개</span>
        </div>
      </section>

      {/* 설정 */}
      <section className="space-y-4">
        <p className="text-[16px] font-semibold text-gray-700">설정</p>

        <button className="w-full bg-white text-left p-5 rounded-2xl shadow-sm">
          알림 설정
        </button>

        <button className="w-full bg-white text-left p-5 rounded-2xl shadow-sm">
          개인정보 및 보안
        </button>

        <button className="w-full bg-white text-left p-5 rounded-2xl shadow-sm text-red-500">
          로그아웃
        </button>
      </section>

    </div>
  );
}
