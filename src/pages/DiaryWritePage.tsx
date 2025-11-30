// src/pages/DiaryWritePage.tsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import turtle from "../assets/turtle.svg";
import VoiceRecorder from "../components/VoiceRecorder";
import { diaryApi } from "../../apis/diaryApi";

export default function DiaryWritePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const date = params.get("date") || "";   // yyyy-MM-dd

  // ⭐ WRITE API용: yyyy.MM.dd
  const apiDateDot = date.replace(/-/g, ".");

  // ⭐ STT API용: yyyy-MM-dd (원본 그대로)
  const apiDateDash = date;

  const formattedDate = date
    ? `${Number(date.split("-")[1])}월 ${Number(date.split("-")[2])}일`
    : "오늘의 일기";

  const [text, setText] = useState("");
  const [isWriting, setIsWriting] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [showRecorder, setShowRecorder] = useState(false);
  const [loadingStt, setLoadingStt] = useState(false);

  const userId = Number(localStorage.getItem("userId"));

  // ===================== 🔥 STT 변환 =====================
  const handleSttConvert = async (file: File) => {
    if (!userId) {
      alert("로그인 정보가 없습니다.");
      return;
    }

    const formData = new FormData();
    formData.append("record_diary", file);

    try {
      setLoadingStt(true);

      // ⭐ STT는 하이픈(-) 날짜
      const res = await diaryApi.sttDiary(userId, apiDateDash, formData);

      const transcript =
        res.data?.data?.transcript ||
        res.data?.data?.diary ||
        "";

      if (!transcript) {
        alert("음성 변환 실패");
        return;
      }

      setText(transcript);
      setIsWriting(true);

      alert("음성 변환 완료!");
    } catch (err) {
      console.error(err);
      alert("음성 변환 중 오류 발생");
    } finally {
      setLoadingStt(false);
    }
  };

  // ===================== ✏️ 일기 등록 =====================
  const handleSubmit = async () => {
    if (!userId) {
      alert("로그인 정보가 없습니다.");
      return;
    }

    const formData = new FormData();
    formData.append("text", text);

    try {
      // ⭐ WRITE는 점(.) 날짜
      await diaryApi.writeDiary(userId, apiDateDot, formData);

      alert("일기 등록 완료!");
      navigate(`/diary/detail/${date}`);
    } catch (err) {
      console.error(err);
      alert("일기 등록 오류");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FDFFF9] pt-8 pb-20 px-6 max-w-md mx-auto">

      {showRecorder && (
        <VoiceRecorder
          onClose={() => setShowRecorder(false)}
          onSave={(file: File) => {
            setAudioFile(file);
            setShowRecorder(false);
            handleSttConvert(file); // 🔥 file 바로 전달
          }}
        />
      )}

      {/* 헤더 */}
      <div className="flex items-center justify-between mb-5">
        <button onClick={() => navigate(-1)} className="text-xl">←</button>
        <p className="text-[18px] font-semibold text-[#2F2F2F]">{formattedDate}</p>
        <button className="text-xl">☰</button>
      </div>

      {/* 작성 박스 */}
      <div className="relative w-full">
        <img src={turtle} className="absolute -top-10 left-2 w-20" />

        <div
          className="bg-[#E8F4E8] rounded-3xl mt-14 p-6 pt-20 min-h-[380px] shadow-md"
          onClick={() => setIsWriting(true)}
        >
          {!isWriting ? (
            <p className="text-gray-600 text-[15px] text-center">
              오늘의 일기를 작성해주세요
            </p>
          ) : (
            <textarea
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-[280px] bg-transparent outline-none resize-none text-[15px] text-gray-700 leading-6"
              placeholder="오늘 있었던 일을 자유롭게 기록해보세요 :)"
            />
          )}
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex justify-between mt-10">
        <button
          className="w-[48%] bg-[#F3F3F3] py-3 rounded-xl text-gray-700 font-bold"
          onClick={() => setShowRecorder(true)}
        >
          {loadingStt ? "변환 중..." : "음성 일기"}
        </button>

        <button
          className="w-[48%] bg-[#9CD841] py-3 rounded-xl text-white font-bold"
          onClick={handleSubmit}
        >
          일기 등록
        </button>
      </div>
    </div>
  );
}
