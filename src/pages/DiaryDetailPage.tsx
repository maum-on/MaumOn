// src/pages/DiaryDetailPage.tsx
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { diaryApi } from "../../apis/diaryApi";

import happyImg from "../assets/turtle_happy.svg";
import sadImg from "../assets/turtle_sad.svg";
import angryImg from "../assets/turtle_angry.svg";
import emptyImg from "../assets/turtle_empty.svg";
import shyImg from "../assets/turtle_shy.svg";

import MenuBottomSheet from "../components/MenuBottomSheet";

export default function DiaryDetailPage() {
  const navigate = useNavigate();
  const { date } = useParams();
  const userId = Number(localStorage.getItem("userId"));

  const [diaryList, setDiaryList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 바텀시트
  const { setIsBottomSheetOpen, setSelectedDate } = useOutletContext<{
    setIsBottomSheetOpen: (v: boolean) => void;
    setSelectedDate: (v: string) => void;
  }>();

  // 감정 이미지 매핑
  const emotionImages: Record<string, string> = {
    happy: happyImg,
    sad: sadImg,
    angry: angryImg,
    shy: shyImg,
    empty: emptyImg,
    normal: emptyImg,
    기쁨: happyImg,
    슬픔: sadImg,
    화남: angryImg,
    부끄러움: shyImg,
    없음: emptyImg,
  };

  // ================================
  // 🔥 여러 개 일기 API 호출
  // ================================
  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        const res = await diaryApi.analyzeDiary(userId, date!);

        // ⭐ 백엔드가 diaries 배열로 내려준다고 가정
        const diaries = res.data.data.diaries;

        setDiaryList(diaries);
      } catch (err) {
        console.error(err);
        alert("일기를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchDiaries();
  }, [date]);

  if (loading) return <p className="text-center mt-10">로딩 중...</p>;

  // 대표 감정 = 첫 번째 일기 기준
  const mainEmotion = diaryList[0]?.emotion || "empty";

  return (
    <div className="w-full min-h-screen bg-[#FDFFF9] px-6 pt-10 pb-24 max-w-md mx-auto">

      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="text-2xl">←</button>
        <p className="text-[18px] font-semibold">{date}</p>
        <button onClick={() => setIsMenuOpen(true)} className="text-2xl">☰</button>
      </div>

      {/* 고정 감정 헤더 */}
      <section className="flex flex-col items-center gap-3 mt-4">
        <img src={emotionImages[mainEmotion]} className="w-32" />
        <p className="text-[16px] text-gray-700 font-medium">오늘의 감정</p>
        <p className="text-[18px] font-semibold text-[#4CAF50]">{mainEmotion}</p>
      </section>

      {/* ================================
           여러 개 일기 렌더링
      ================================= */}
      {diaryList.map((diary, i) => (
        <div key={i} className="mb-10">

          {/* 텍스트 일기 */}
          {diary.write_diary && (
            <section className="mt-6">
              <p className="text-[15px] text-gray-700 mb-1 font-semibold">
                내가 쓴 일기 {i > 0 ? `#${i + 1}` : ""}
              </p>
              <div className="bg-[#E8F4E8] rounded-2xl p-5 shadow-sm">
                <p className="text-gray-700 text-[14px] leading-6">{diary.write_diary}</p>
              </div>
            </section>
          )}

          {/* 파일 요약 */}
          {diary.file_summation?.length > 0 && (
            <section className="mt-6">
              <p className="text-[15px] text-gray-700 mb-1 font-semibold">
                파일 요약 {i > 0 ? `#${i + 1}` : ""}
              </p>

              <div className="bg-[#E8F4E8] rounded-2xl p-5 shadow-sm flex flex-wrap gap-2">
                {diary.file_summation.map((text: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-white border border-[#A8C686] rounded-xl text-sm text-gray-700"
                  >
                    {text}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* 그림 일기 */}
          {diary.draw && (
            <section className="mt-6">
              <p className="text-[15px] text-gray-700 mb-1 font-semibold">
                내가 그린 그림 {i > 0 ? `#${i + 1}` : ""}
              </p>
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <img src={diary.draw} className="w-full rounded-xl" />
              </div>
            </section>
          )}

          {/* AI 텍스트 답장 */}
          {diary.ai_reply && (
            <section className="mt-4">
              <p className="text-[15px] text-gray-700 mb-1 font-semibold">AI 답장</p>
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <p className="text-gray-600 text-[14px] leading-6">{diary.ai_reply}</p>
              </div>
            </section>
          )}

          {/* AI 그림 답장 */}
          {diary.ai_draw_reply && (
            <section className="mt-4">
              <p className="text-[15px] text-gray-700 mb-1 font-semibold">AI 그림 답장</p>
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <p className="text-gray-600 text-[14px] leading-6">{diary.ai_draw_reply}</p>
              </div>
            </section>
          )}

          {/* 구분선 */}
          {i < diaryList.length - 1 && <hr className="my-10 border-gray-300" />}
        </div>
      ))}

      {/* 추가하기 */}
      <div className="mt-10 flex justify-center">
        <button
          onClick={() => {
            setSelectedDate(date!);
            setIsBottomSheetOpen(true);
          }}
          className="px-6 py-3 bg-[#4CAF50] text-gray-700 rounded-xl font-semibold shadow"
        >
          일기 추가하기
        </button>
      </div>

      <MenuBottomSheet isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  );
}
