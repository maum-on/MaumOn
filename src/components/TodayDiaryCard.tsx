export default function TodayDiaryCard() {
  return (
    <section className="bg-white rounded-xl shadow-sm p-4">
      <h2 className="text-gray-800 text-sm font-semibold mb-3">오늘의 일기</h2>
      <div className="flex justify-around">
        <button className="flex flex-col items-center">
          <span className="text-2xl">📝</span>
          <span className="text-xs mt-1">일기쓰기</span>
        </button>
        <button className="flex flex-col items-center">
          <span className="text-2xl">📁</span>
          <span className="text-xs mt-1">파일등록</span>
        </button>
        <button className="flex flex-col items-center">
          <span className="text-2xl">🎨</span>
          <span className="text-xs mt-1">그림일기</span>
        </button>
      </div>
    </section>
  );
}
