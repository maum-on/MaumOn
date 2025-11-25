export default function EmotionBar() {
  return (
    <section className="space-y-1">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-700">이번 달 마음의 온도</p>
        <span className="text-sm font-semibold text-[#4CAF50]">30°C</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full">
        <div className="w-1/3 h-full bg-[#A8C686] rounded-full" />
      </div>
    </section>
  );
}
