type CalendarSectionProps = {
  onDayClick: () => void;
};

export default function CalendarSection({ onDayClick }: CalendarSectionProps) {
  return (
    <section className="bg-white rounded-2xl shadow-sm p-5">
      <p className="text-gray-800 font-medium text-sm mb-3">2025.09</p>

      <div className="grid grid-cols-7 text-center text-xs text-gray-700 mb-4">
        <span>SUN</span><span>MON</span><span>TUE</span>
        <span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-sm text-gray-600">
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            onClick={onDayClick}   // ← 날짜 클릭 시 바텀시트 열기!
            className={`
              py-2 rounded-full cursor-pointer
              hover:bg-gray-100
              ${[9, 10, 18, 19].includes(i + 1) ? "bg-[#A8C686] text-white" : ""}
            `}
          >
            {i + 1}
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-3">
        기분이 좋은 사용자를 스캐너로 감정분석 중이에요 🌿
      </p>
    </section>
  );
}
