// src/pages/DiaryWritePage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import turtle from "../assets/turtle.png";
import VoiceRecorder from "../components/VoiceRecorder";

export default function DiaryWritePage() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [isWriting, setIsWriting] = useState(false);
  const [showRecorder, setShowRecorder] = useState(false);
  const [voiceFileUrl, setVoiceFileUrl] = useState<string | null>(null);

  return (
    <div className="w-full min-h-screen bg-[#FDFFF9] pt-8 pb-20 px-6 max-w-md mx-auto">

      {showRecorder && (
        <VoiceRecorder
          onClose={() => setShowRecorder(false)}
          onSave={(url) => {
            setVoiceFileUrl(url);
            setShowRecorder(false);
          }}
        />
      )}

      {/* 헤더 */}
      <div className="flex items-center justify-between mb-5">
        <button onClick={() => navigate(-1)} className="text-xl">←</button>
        <p className="text-[18px] font-semibold text-[#2F2F2F]">오늘의 일기</p>
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
          음성 일기
        </button>

        <button className="w-[48%] bg-[#F3F3F3] py-3 rounded-xl text-gray-700 font-bold">
          일기 등록
        </button>
      </div>
    </div>
  );
}
