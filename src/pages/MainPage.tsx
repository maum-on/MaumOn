import { useOutletContext } from "react-router-dom";
import { useState } from "react";

import happy from "../assets/character1.png";
import angry from "../assets/character2.png";
import calm from "../assets/character3.png";

export default function MainPage() {
  // ⭐ MainLayout에서 전달받은 바텀시트 열기 함수
  const { setIsBottomSheetOpen } =
    useOutletContext<{ setIsBottomSheetOpen: (v: boolean) => void }>();

  // ⭐ 현재 달
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // ⭐ 특정 날짜 강조하고 싶으면 yyyy-mm-dd 형식으로 기록
  const highlightedDates = ["2025-09-08", "2025-09-10", "2025-09-15"];

  // ⭐ 달력 날짜 생성 함수
  const calendarDays = (() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1).getDay(); // 이번달 시작 요일
    const lastDate = new Date(year, month + 1, 0).getDate(); // 마지막 날짜

    const days: ({ date: number; dateString: string } | null)[] = [];

    // (1) 시작 요일까지 null 채우기
    for (let i = 0; i < firstDay; i++) days.push(null);

    // (2) 날짜 채우기
    for (let date = 1; date <= lastDate; date++) {
      const dateString = `${year}-${String(month + 1).padStart(
        2,
        "0"
      )}-${String(date).padStart(2, "0")}`;
      days.push({ date, dateString });
    }

    return days;
  })();

  return (
    <div className="w-full min-h-screen bg-[#FDFFF9] pt-14 pb-10 overflow-auto">
      <div className="max-w-md mx-auto space-y-12 px-8">

        {/* ===== 마음의 온도 ===== */}
        <section className="mt-3">
          <div className="flex justify-between items-center mb-3">
            <p className="text-[16px] text-gray-700">이번 달 마음의 온도</p>
            <span className="text-[16px] font-semibold text-[#4CAF50]">30°C</span>
          </div>

          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div className="w-1/3 h-full bg-[#A8C686] rounded-full" />
          </div>
        </section>

        {/* ===== 감정 캐릭터 박스 ===== */}
        <section className="relative flex justify-center bg-[#E8F4E8] rounded-3xl py-20 shadow-md">
          <img src={happy} className="absolute top-8 left-8 w-20 opacity-90" />
          <img src={angry} className="w-40 z-10" />
          <img src={calm} className="absolute top-8 right-8 w-20 opacity-90" />
        </section>

        {/* ===== 캘린더 ===== */}
        <section className="bg-white rounded-2xl shadow-md p-7">

          {/* 월 이동 */}
          <div className="flex justify-between items-center mb-5">
            <button
              onClick={() =>
                setCurrentMonth(
                  (prev) =>
                    new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
                )
              }
              className="text-xl text-gray-500"
            >
              &lt;
            </button>

            <p className="text-gray-800 font-medium text-[17px]">
              {currentMonth.getFullYear()}.
              {String(currentMonth.getMonth() + 1).padStart(2, "0")}
            </p>

            <button
              onClick={() =>
                setCurrentMonth(
                  (prev) =>
                    new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
                )
              }
              className="text-xl text-gray-500"
            >
              &gt;
            </button>
          </div>

          {/* 요일 */}
          <div className="grid grid-cols-7 text-center text-gray-600 text-[13px] mb-4">
            <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span>
            <span>THU</span><span>FRI</span><span>SAT</span>
          </div>

          {/* 날짜 */}
          <div className="grid grid-cols-7 gap-3 text-center text-gray-700 text-[14px]">
            {calendarDays.map((day, i) => (
              <div
                key={i}
                onClick={() => day && setIsBottomSheetOpen(true)}
                className={`py-2 rounded-full cursor-pointer transition
                  ${day ? "hover:bg-[#C7DDB3]" : ""}
                  ${
                    day && highlightedDates.includes(day.dateString)
                      ? "bg-[#A8C686] text-white"
                      : ""
                  }
                `}
              >
                {day?.date || ""}
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-500 mt-5 flex items-center">
            <span className="text-[#4CAF50] mr-2 text-xl">🌿</span>
            기쁨이 높은 사용자를 스캐너로 감정 분석 중이에요.
          </p>
        </section>

        {/* ===== 오늘의 라디오 (수정 버전) ===== */}
        <section className="bg-white rounded-2xl shadow-md p-7 mb-10">
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-800 font-semibold text-[17px]">
              오늘의 라디오
            </p>
            <button className="text-[#4CAF50] text-sm font-medium">
              듣기 &gt;
            </button>
          </div>

          <div className="border border-gray-200 rounded-2xl p-10 flex flex-col items-center justify-center text-gray-500">

            {/* 라디오 아이콘 영역 */}
            <div className="w-20 h-20 mb-4 flex items-center justify-center rounded-full bg-[#F6F9F2] shadow-inner">
              <span className="text-3xl">📻</span>
            </div>

            <p className="text-gray-600 text-[14px] font-medium mb-3">
              오늘의 추천 라디오 
            </p>

            <p className="text-gray-400 text-[12px] text-center">
              마음을 편안하게 해보세요 🌿
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
