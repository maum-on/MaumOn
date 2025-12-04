// src/pages/DiaryWritePage.tsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import turtle from "../assets/turtle.svg";
import VoiceRecorder from "../components/VoiceRecorder";
import { diaryApi } from "../../apis/diaryApi";

export default function DiaryWritePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const date = params.get("date") || "";
  const isEdit = params.get("edit") === "true";

  const originalText = location.state?.originalText || "";

  const apiDateDot = date.replace(/-/g, ".");
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

  useEffect(() => {
    if (isEdit && originalText) {
      setText(originalText);
      setIsWriting(true);
    }
  }, [isEdit, originalText]);

  const handleSttConvert = async (file: File) => {
    if (!userId) {
      alert("로그인 정보가 없습니다.");
      return;
    }

    const formData = new FormData();
    formData.append("audio", file);

    try {
      setLoadingStt(true);

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
      setAudioFile(file);

      alert("음성 변환 완료!");
    } catch (err) {
      console.error(err);
      alert("음성 변환 중 오류 발생");
    } finally {
      setLoadingStt(false);
    }
  };

  const handleSubmit = async () => {
    if (!userId) {
      alert("로그인 정보가 없습니다.");
      return;
    }

    const formData = new FormData();
    formData.append("text", text);

    if (audioFile) {
      formData.append("audio", audioFile);
    }

    try {
      await diaryApi.writeDiary(userId, apiDateDot, formData);

      alert(isEdit ? "일기 수정 완료!" : "일기 등록 완료!");

      navigate(`/diary/detail/${date}`);
    } catch (err) {
      console.error(err);
      alert(isEdit ? "일기 수정 오류" : "일기 등록 오류");
    }
  };

  // 🔥 버튼 활성화 여부
  const isActive = text.trim().length > 0 || audioFile !== null;

  return (
    <div className="w-full min-h-screen bg-[#FDFFF9] pt-8 pb-20 px-6 max-w-md mx-auto">

      {showRecorder && (
        <VoiceRecorder
          onClose={() => setShowRecorder(false)}
          onSave={(file: File) => {
            setShowRecorder(false);
            handleSttConvert(file);
          }}
        />
      )}

      <div className="flex items-center justify-between mb-5">
        <button onClick={() => navigate(-1)} className="text-xl">←</button>
        <p className="text-[18px] font-semibold text-[#2F2F2F]">{formattedDate}</p>
        <button className="text-xl">☰</button>
      </div>

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

      <div className="flex justify-between mt-10">
        <button
          className="w-[48%] bg-[#F3F3F3] py-3 rounded-xl text-gray-700 font-bold"
          onClick={() => setShowRecorder(true)}
        >
          {loadingStt ? "변환 중..." : "음성 일기"}
        </button>

<button
  onClick={handleSubmit}
  className={`w-[48%] py-3 rounded-xl font-bold transition
    ${
      isActive
        ? "bg-[#A1BC77] text-gray-700 cursor-pointer hover:bg-[#94AE6C]"
        : "bg-[#F3F3F3] text-gray-400 cursor-not-allowed pointer-events-none"
    }
  `}
>
  {isEdit ? "일기 수정" : "일기 등록"}
</button>

      </div>
    </div>
  );
}
