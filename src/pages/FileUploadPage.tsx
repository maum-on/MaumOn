import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import turtle from "../assets/turtle.png";
import file_icon from "../assets/file_icon.png";
import kakao_icon from "../assets/kakao_icon.png";
import insta_icon from "../assets/insta_icon.png";
import KakaoGuide from "../components/KakaoGuide";
import InstaGuide from "../components/InstaGuide";

export default function FileUploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showOptions, setShowOptions] = useState(false);
  const [step, setStep] = useState(0);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // 카카오톡 가이드
  if (step >= 1 && step < 100) return <KakaoGuide step={step} setStep={setStep} />;
  // 인스타그램 가이드
  if (step >= 100) return <InstaGuide step={step} setStep={setStep} />;

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  return (
    <div className="w-full min-h-screen bg-[#FDFFF9] pt-8 pb-20 px-6 max-w-md mx-auto">

      {/* ===== 헤더 ===== */}
      <div className="flex items-center justify-between mb-5">
        <button onClick={() => navigate(-1)} className="text-xl">←</button>
        <p className="text-[18px] font-semibold text-[#2F2F2F]">파일 등록</p>
        <button className="text-xl">☰</button>
      </div>

      {/* ===== 업로드 박스 ===== */}
      <div className="relative w-full">
        <img
          src={turtle}
          className="absolute -top-10 left-2 w-20 z-0 pointer-events-none"
        />

        <div className="bg-[#EEF9E9] rounded-3xl mt-14 px-6 pt-16 pb-10 min-h-[320px] text-center flex flex-col items-center justify-center">

          {/* 파일이 없을 때만 표시 */}
          {!selectedFile && (
            <>
              <img src={file_icon} className="w-24 mx-auto mb-4 opacity-90" />
              <p className="text-[16px] text-gray-700 font-medium">파일을 등록해주세요</p>
              <p className="text-[12px] text-gray-500 mt-2 leading-4">
                🔒 개인정보 보호 중 <br />
                채팅 파일은 서버에 저장되지 않습니다
              </p>
            </>
          )}

          {/* 파일 선택된 경우만 표시 */}
          {selectedFile && (
            <div className="mt-4 flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-200">
              <span className="text-gray-700 text-sm">
                {selectedFile.name}
              </span>

              {/* 부드러운 X 버튼 */}
              <button
                onClick={() => setSelectedFile(null)}
                className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition"
              >
                <span className="text-gray-600 text-sm">✕</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 숨겨진 파일 input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={onFileChange}
      />

      {/* ===== "파일은 어떻게 받나요?" ===== */}
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="w-full bg-white border border-gray-300 py-3 rounded-xl text-gray-700 font-medium shadow-sm mt-10"
      >
        파일은 어떻게 받나요?
      </button>

      {/* SNS 옵션 */}
      {showOptions && (
        <div className="mt-8 grid grid-cols-2 gap-6 justify-items-center">

          {/* 카카오톡 */}
          <button
            className="bg-[#9CD841] rounded-2xl py-6 w-28 flex flex-col items-center shadow-sm"
            onClick={() => setStep(1)}
          >
            <img src={kakao_icon} className="w-12 h-12 mb-3 opacity-90" />
            <span className="text-white font-medium text-sm">카카오톡</span>
          </button>

          {/* 인스타그램 */}
          <button
            className="bg-[#9CD841] rounded-2xl py-6 w-28 flex flex-col items-center shadow-sm"
            onClick={() => setStep(100)}
          >
            <img src={insta_icon} className="w-12 h-12 mb-3 opacity-90" />
            <span className="text-white font-medium text-sm">인스타그램</span>
          </button>

        </div>
      )}

      {/* ===== 파일 선택 버튼 ===== */}
      <button
        onClick={handleChooseFile}
        className="w-full bg-white border border-gray-300 py-3 rounded-xl text-gray-700 font-medium shadow-sm mt-10"
      >
        파일 선택
      </button>

      {/* ===== 파일 등록 버튼 ===== */}
      <button
        disabled={!selectedFile}
        className={`w-full py-3 rounded-xl font-medium shadow-sm mt-6 transition 
          ${selectedFile ? "bg-[#9CD841] text-white" : "bg-gray-200 text-gray-400"}`}
      >
        파일 등록
      </button>

    </div>
  );
}
