//src/pages/DiaryDetailPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import turtle from "../assets/turtle.svg";
import volume from "../assets/volume.svg";

export default function DiaryDetailPage() {
  const navigate = useNavigate();
  const { date } = useParams(); // ← URL에서 날짜 가져오기

  return (
    <div className="w-full min-h-screen bg-[#FDFFF9] px-6 pt-10 pb-16 max-w-md mx-auto">

      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="text-2xl">
          ←
        </button>
        <p className="text-[18px] font-semibold">{date}</p>
        <button className="text-2xl">☰</button>
      </div>

      {/* 오늘의 감정 */}
      <section className="flex flex-col items-center gap-3 mt-4">
        <img src={turtle} className="w-32" />
        <p className="text-[16px] text-gray-700 font-medium">오늘의 감정</p>
        <p className="text-[18px] font-semibold text-[#4CAF50]">😊 행복</p>
      </section>

      {/* 내가 쓴 일기 */}
      <section className="mt-8">
        <p className="text-[15px] text-gray-700 mb-2 font-semibold">
          내가 쓴 일기
        </p>

        <div className="bg-[#E8F4E8] rounded-2xl p-5 shadow-sm relative">
          <p className="text-gray-700 text-[14px] leading-6">
            오늘 홍대에 분위기 좋은 카페에 가서 친구와 수다 떨고  
            맛있는 밥 먹고 예쁜 페스티벌 갔어!  
            너무 행복했어 🌿
          </p>

          {/* 수정 버튼 */}
          {/*<button className="absolute bottom-3 right-3 px-4 py-1 bg-white border border-[#A8C686] text-[#4CAF50] rounded-full text-sm shadow-sm">
            수정
          </button>*/}
        </div>
      </section>

      {/* AI 답장 */}
      <section className="mt-8">
        <p className="text-[15px] text-gray-700 mb-2 font-semibold">AI 답장</p>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm relative">
          <p className="text-gray-600 text-[14px] leading-6">
            기분이 좋아져서 다행이야!  
            좋아하는 노래 플레이리스트 만들어서  
            자주 듣는 것도 좋은 방법이야 🌱
          </p>

          {/* 스피커 아이콘 (조금 위로 올림) */}
          {/*<button className="absolute bottom-3 right-3 translate-y-[-10px]">
            <img src={volume} className="w-6 opacity-80" />
          </button>*/}
        </div>
      </section>

    </div>
  );
}
