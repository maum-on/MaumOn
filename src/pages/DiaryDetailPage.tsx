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

  // 🔥 여러 일기를 담는 배열
  const [diaryList, setDiaryList] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  // 메뉴 bottomsheet
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 🔥 MainLayout에서 전달된 날짜 선택 바텀시트
  const { setIsBottomSheetOpen, setSelectedDate } = useOutletContext<{
    setIsBottomSheetOpen: (v: boolean) => void;
    setSelectedDate: (v: string) => void;
  }>();

  // 감정 이미지 맵핑
  const emotionImages: Record<string, string> = {
    happy: happyImg,
    기쁨: happyImg,
    sad: sadImg,
    슬픔: sadImg,
    angry: angryImg,
    화남: angryImg,
    shy: shyImg,
    부끄러움: shyImg,
    empty: emptyImg,
    normal: emptyImg,
    없음: emptyImg,
  };

  // ================================
  // 🔥 API + localStorage 합쳐서 여러일기 구성
  // ================================
  useEffect(() => {
    const fetchDiary = async () => {
      try {
        const res = await diaryApi.analyzeDiary(userId, date!);
        const data = res.data.data;

        // 백엔드 기본 일기
        const backendDiary = {
          emotion: data.emotion,
          writeDiary: data.write_diary || "",
          draw: data.draw || null,
          fileSummation: data.file_summation || [],
          aiReply: data.ai_reply || "",
          aiDrawReply: data.ai_draw_reply || "",
        };

        // localStorage 추가일기 불러오기
        const saved = JSON.parse(localStorage.getItem(`diary-${date}`) || "[]");

        // 기존 + 추가일기 합침
        const merged = [backendDiary, ...saved];

        setDiaryList(merged);
      } catch (err) {
        console.error("일기 조회 오류:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDiary();
  }, [date]);

  if (loading) return <p className="text-center mt-10">로딩 중...</p>;

  // ⭐ 대표 감정 → 맨 첫 번째 일기 감정
  const mainEmotion = diaryList[0]?.emotion || "empty";

  return (
    <div className="w-full min-h-screen bg-[#FDFFF9] px-6 pt-10 pb-24 max-w-md mx-auto">

      {/* 🔙 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="text-2xl">←</button>
        <p className="text-[18px] font-semibold">{date}</p>
        <button onClick={() => setIsMenuOpen(true)} className="text-2xl">☰</button>
      </div>

      {/* ========================  
          고정 감정 헤더 (크기 변함 없음)
      ========================== */}
      <section className="flex flex-col items-center gap-3 mt-4">
        <img src={emotionImages[mainEmotion]} className="w-32" />
        <p className="text-[16px] text-gray-700 font-medium">오늘의 감정</p>
        <p className="text-[18px] font-semibold text-[#4CAF50]">{mainEmotion}</p>
      </section>

      {/* ================================
           🔥 일기를 여러개 렌더링
      ================================= */}
      {diaryList.map((diary, i) => (
        <div key={i} className="mb-10">

          {/* 텍스트 일기 */}
          {diary.writeDiary && diary.fileSummation.length === 0 && !diary.draw && (
            <section className="mt-6">
              <p className="text-[15px] text-gray-700 mb-1 font-semibold">
                내가 쓴 일기 {i === 0 ? "" : `#${i + 1}`}
              </p>
              <div className="bg-[#E8F4E8] rounded-2xl p-5 shadow-sm">
                <p className="text-gray-700 text-[14px] leading-6">{diary.writeDiary}</p>
              </div>
            </section>
          )}

          {/* 파일 요약 */}
          {diary.fileSummation.length > 0 && (
            <section className="mt-6">
              <p className="text-[15px] text-gray-700 mb-1 font-semibold">
                파일 요약 {i === 0 ? "" : `#${i + 1}`}
              </p>

              <div className="bg-[#E8F4E8] rounded-2xl p-5 shadow-sm flex flex-wrap gap-2">
                {diary.fileSummation.map((item: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-white border border-[#A8C686] rounded-xl text-sm text-gray-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* 그림 일기 */}
          {diary.draw && (
            <section className="mt-6">
              <p className="text-[15px] text-gray-700 mb-1 font-semibold">
                내가 그린 그림 {i === 0 ? "" : `#${i + 1}`}
              </p>
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <img src={diary.draw} className="w-full rounded-xl" />
              </div>
            </section>
          )}

          {/* AI 텍스트 답장 */}
          {(diary.writeDiary || diary.fileSummation.length > 0) && diary.aiReply && (
            <section className="mt-4">
              <p className="text-[15px] text-gray-700 mb-1 font-semibold">AI 답장</p>
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <p className="text-gray-600 text-[14px] leading-6">{diary.aiReply}</p>
              </div>
            </section>
          )}

          {/* AI 그림 답장 */}
          {diary.draw && diary.aiDrawReply && (
            <section className="mt-4">
              <p className="text-[15px] text-gray-700 mb-1 font-semibold">AI 그림 답장</p>
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <p className="text-gray-600 text-[14px] leading-6">{diary.aiDrawReply}</p>
              </div>
            </section>
          )}

          {/* 구분선 */}
          {i < diaryList.length - 1 && <hr className="my-10 border-gray-300" />}
        </div>
      ))}

      {/* ================================
           ⭐ 추가하기 버튼 (맨 아래 유지)
      ================================= */}
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
