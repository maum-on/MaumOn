import grayTurtle from "../assets/character_gray.png";

export default function MonthlyTestCard() {
  return (
    <section className="bg-white rounded-2xl shadow-sm p-5">
      <div className="flex justify-between items-center mb-2">
        <p className="text-gray-700 font-semibold text-sm">이번 달 심리 테스트</p>
        <button className="text-xs text-gray-400">테스트 진행하기 &gt;</button>
      </div>

      <div className="border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-gray-400 text-xs">
        <img src={grayTurtle} className="w-16 mb-2 opacity-70" />
        <p>아직 이번 달 심리 테스트를 진행하지 않았어요</p>
      </div>
    </section>
  );
}
