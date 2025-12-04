// src/pages/MainPage.tsx
import { useOutletContext, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import happyImg from "../assets/happy.svg";
import angryImg from "../assets/angry.svg";
import emptyImg from "../assets/empty.svg";
import shyImg from "../assets/shy.svg";
import { homeApi } from "../../apis/homeApi";

export default function MainPage() {
  const navigate = useNavigate();

  const { setIsBottomSheetOpen, setSelectedDate } =
    useOutletContext<{
      setIsBottomSheetOpen: (v: boolean) => void;
      setSelectedDate: (v: string) => void;
    }>();

  const formatDotDate = (date: string) => date.replace(/-/g, ".");
  const toDashDate = (dot: string) => dot.replace(/\./g, "-");

  const [temperature, setTemperature] = useState<number | null>(null);
  const [writtenDates, setWrittenDates] = useState<string[]>([]);
  const [emotionCount, setEmotionCount] = useState<Record<string, number>>({});

  // ⭐ activity_recommend 추가
  const [activityRecommend, setActivityRecommend] = useState("");

  // 🎧 라디오 API state
  const [boostMessage, setBoostMessage] = useState("");
  const [boostEmotion, setBoostEmotion] = useState("");
  const [audioPath, setAudioPath] = useState("");

  const userId = localStorage.getItem("userId");
  const today = formatDotDate(new Date().toISOString().slice(0, 10));

  // ================== API 호출 ==================
  useEffect(() => {
    const fetchHomeData = async () => {
      if (!userId) return;

      try {
        const res = await homeApi.getHomeData(userId, today);
        const data = res.data.data;

        setTemperature(data.temperature);

        const exists = Object.keys(data.diary_existence).filter(
          (date) => data.diary_existence[date].write === true
        );
        setWrittenDates(exists);

        setEmotionCount(data.emotions || {});

        // ⭐ 활동 추천 저장
        setActivityRecommend(data.activity_recommend || "");
      } catch (err) {
        console.error("홈 데이터 오류:", err);
      }
    };

    const fetchBoost = async () => {
      if (!userId) return;

      try {
        const res = await homeApi.getBoostMessage(userId, today);
        console.log("BOOST API RESPONSE:", res.data);
        const data = res.data.data;

        setBoostMessage(data.message || "");
        setBoostEmotion(data.diary_meta?.emotion || "");
        setAudioPath(data.audio_path || "");
      } catch (err) {
        console.error("boost 오류:", err);
      }
    };

    fetchHomeData();
    fetchBoost();
  }, [userId, today]);

  // ================== 감정 top3 ==================
  const sortedEmotions: [string, number][] = Object.entries(emotionCount)
    .filter(([_, count]: [string, number]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  const emotionImages: Record<string, string> = {
    happy: happyImg,
    기쁨: happyImg,

    sad: emptyImg,
    슬픔: emptyImg,

    angry: angryImg,
    화남: angryImg,

    shy: shyImg,
    부끄러움: shyImg,

    empty: emptyImg,
    normal: emptyImg,
    없음: emptyImg,
  };

  // ================== 캘린더 ==================
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const calendarDays = (() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    const days = [] as ({ date: number; dateString: string } | null)[];

    for (let i = 0; i < firstDay; i++) days.push(null);

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

        {/* =================== 마음의 온도 =================== */}
        <section className="mt-3">
          <div className="flex justify-between items-center mb-3">
            <p className="text-[16px] text-gray-700">이번 달 마음의 온도</p>
            <span className="text-[16px] font-semibold text-[#4CAF50]">
              {temperature !== null ? `${temperature}°C` : "로딩중"}
            </span>
          </div>

          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-[#A8C686] rounded-full transition-all"
              style={{
                width: temperature !== null ? `${temperature}%` : "0%",
              }}
            />
          </div>
        </section>

        {/* =================== 감정 캐릭터 박스 =================== */}
        <section className="relative flex justify-center bg-[#E8F4E8] rounded-3xl py-20 shadow-md">
          {sortedEmotions.length > 0 ? (
            <>
              {sortedEmotions[1] && (
                <img
                  src={emotionImages[sortedEmotions[1][0]]}
                  className="absolute top-8 left-8 w-20 opacity-90"
                />
              )}

              <img
                src={emotionImages[sortedEmotions[0][0]]}
                className="w-40 z-10"
              />

              {sortedEmotions[2] && (
                <img
                  src={emotionImages[sortedEmotions[2][0]]}
                  className="absolute top-8 right-8 w-20 opacity-90"
                />
              )}
            </>
          ) : (
            <p className="text-gray-500">감정 데이터가 없습니다.</p>
          )}
        </section>

        {/* =================== 캘린더 =================== */}
        <section className="bg-white rounded-2xl shadow-md p-7">
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
                onClick={() => {
                  if (!day) return;

                  const dotDate = day.dateString.replace(/-/g, ".");
                  const dashDate = toDashDate(day.dateString);

                  if (writtenDates.includes(dotDate)) {
                    navigate(`/diary/detail/${dashDate}`);
                  } else {
                    setSelectedDate(dashDate);
                    setIsBottomSheetOpen(true);
                  }
                }}
                className={`py-2 rounded-full cursor-pointer transition
                  ${day ? "hover:bg-[#C7DDB3]" : ""}
                  ${
                    day &&
                    writtenDates.includes(day.dateString.replace(/-/g, "."))
                      ? "bg-[#A8C686] text-white"
                      : ""
                  }`}
              >
                {day?.date || ""}
              </div>
            ))}
          </div>

          {/* ⭐ activity_recommend 표시 */}
          <p className="text-sm text-gray-500 mt-5 flex items-center">
            <span className="text-[#4CAF50] mr-2 text-xl">🌿</span>
            {activityRecommend || "일기를 쓰며 하루를 정리해보아요!"}
          </p>
        </section>

        {/* =================== 오늘의 라디오 =================== */}
        <section className="bg-white rounded-2xl shadow-md p-7 mb-10">
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-800 font-semibold text-[17px]">
              오늘의 라디오
            </p>
            {audioPath && (
              <a
                href={audioPath}
                target="_blank"
                className="text-[#4CAF50] text-sm font-medium"
              >
                듣기 &gt;
              </a>
            )}
          </div>

          <div className="border border-gray-200 rounded-2xl p-10 flex flex-col items-center justify-center text-gray-500">
            <div className="w-20 h-20 mb-4 flex items-center justify-center rounded-full bg-[#F6F9F2] shadow-inner">
              <span className="text-3xl">📻</span>
            </div>

            <p className="text-gray-600 text-[14px] font-medium mb-3">
              {boostEmotion ? `오늘의 감정: ${boostEmotion}` : "로딩 중..."}
            </p>

            <p className="text-gray-400 text-[12px] text-center">
              {boostMessage || "응원 메시지를 불러오는 중..."}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
