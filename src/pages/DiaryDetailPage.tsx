// src/pages/DiaryDetailPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { diaryApi } from "../../apis/diaryApi";
import happy from "../assets/turtle.svg";
import angry from "../assets/character2.png";
import sad from "../assets/character3.png";
import empty from "../assets/character_gray.png";
import shy from "../assets/character1.png"; // <-- shy 이미지 넣어줘!

export default function DiaryDetailPage() {
  const navigate = useNavigate();
  const { date } = useParams();
  const userId = Number(localStorage.getItem("userId"));

  const [loading, setLoading] = useState(true);

  const [emotion, setEmotion] = useState("");
  const [draw, setDraw] = useState<string | null>(null);
  const [writeDiary, setWriteDiary] = useState("");
  const [fileSummation, setFileSummation] = useState<string[]>([]);
  const [aiReply, setAiReply] = useState("");
  const [aiDrawReply, setAiDrawReply] = useState("");

  // 🔥 감정 이미지 매핑
  const emotionImages: Record<string, string> = {
    happy,
    angry,
    sad,
    empty,
    shy,
  };

  // 🔥 데이터 요청
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await diaryApi.analyzeDiary(userId, date!);
        const data = res.data.data;

        setEmotion(data.emotion);
        setDraw(data.draw);
        setWriteDiary(data.write_diary || "");
        setFileSummation(data.file_summation || []);
        setAiReply(data.ai_reply || "");
        setAiDrawReply(data.ai_draw_reply || "");
      } catch (err) {
        alert("일기 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date]);

  if (loading) return <p className="text-center mt-16">로딩 중...</p>;

  // -----------------------------------
  // 🔥 조건 분류
  // -----------------------------------
  const isTextDiary = writeDiary && fileSummation.length === 0 && !draw;
  const isFileDiary = fileSummation.length > 0;
  const isDrawDiary = !!draw;

  return (
    <div className="w-full min-h-screen bg-[#FDFFF9] px-6 pt-10 pb-16 max-w-md mx-auto">
      
      {/* 🔙 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="text-2xl">←</button>
        <p className="text-[18px] font-semibold">{date}</p>
        <button className="text-2xl">☰</button>
      </div>

      {/* 🐢 오늘의 감정 */}
      <section className="flex flex-col items-center gap-3 mt-4">
        <img
          src={emotionImages[emotion] || empty}
          className="w-32"
        />
        <p className="text-[16px] text-gray-700 font-medium">오늘의 감정</p>
        <p className="text-[18px] font-semibold text-[#4CAF50]">
          {emotion}
        </p>
      </section>

      {/* ✏️ 내가 쓴 일기 */}
      {isTextDiary && (
        <section className="mt-8">
          <div className="flex justify-between items-center mb-2">
            <p className="text-[15px] text-gray-700 font-semibold">
              내가 쓴 일기
            </p>

            {/* ✨ 수정 버튼 */}
            <button
              onClick={() =>
                navigate(`/diary/write?date=${date}&edit=true`, {
                  state: { originalText: writeDiary },
                })
              }
              className="px-4 py-1 bg-[#A8C686] text-gray-700 rounded-full text-sm shadow"
            >
              수정하기
            </button>
          </div>

          <div className="bg-[#E8F4E8] rounded-2xl p-5 shadow-sm">
            <p className="text-gray-700 text-[14px] leading-6">
              {writeDiary}
            </p>
          </div>
        </section>
      )}

      {/* 📄 파일 요약 */}
      {isFileDiary && (
        <section className="mt-8">
          <p className="text-[15px] text-gray-700 mb-2 font-semibold">파일 요약</p>

          <div className="bg-[#E8F4E8] rounded-2xl p-5 shadow-sm flex flex-wrap gap-2">
            {fileSummation.map((item, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-white border border-[#A8C686] rounded-xl text-sm text-gray-700"
              >
                {item}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* 🎨 그림 일기 */}
      {isDrawDiary && (
        <section className="mt-8">
          <p className="text-[15px] text-gray-700 mb-2 font-semibold">내가 그린 그림</p>

          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <img src={draw!} alt="그림 일기" className="w-full rounded-xl" />
          </div>
        </section>
      )}

      {/* 🤖 AI 답장 */}
      {(isTextDiary || isFileDiary) && (
        <section className="mt-8">
          <p className="text-[15px] text-gray-700 mb-2 font-semibold">AI 답장</p>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <p className="text-gray-600 text-[14px] leading-6">{aiReply}</p>
          </div>
        </section>
      )}

      {/* 🎨 AI 그림 답장 */}
      {isDrawDiary && (
        <section className="mt-8">
          <p className="text-[15px] text-gray-700 mb-2 font-semibold">AI 답장</p>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <p className="text-gray-600 text-[14px] leading-6">{aiDrawReply}</p>
          </div>
        </section>
      )}
    </div>
  );
}
