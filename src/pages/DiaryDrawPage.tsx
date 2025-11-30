// src/pages/DiaryDrawPage.tsx
import { useNavigate, useLocation } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import turtle from "../assets/turtle.svg";
import arrowleft from "../assets/arrowleft.svg";
import eraser from "../assets/eraser.svg";
import arrowright from "../assets/arrowright.svg";
import { diaryApi } from "../../apis/diaryApi";

export default function DiaryDrawPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const date = params.get("date") || "";

  const userId = Number(localStorage.getItem("userId"));

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const undoStackRef = useRef<ImageData[]>([]);
  const redoStackRef = useRef<ImageData[]>([]);

  // ============================
  //   초기 캔버스 설정
  // ============================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 화면 크기에 맞게 캔버스 내부 픽셀 설정
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // willReadFrequently 적용 (경고 제거 + undo 안정화)
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    ctx.lineCap = "round";
    ctx.strokeStyle = "#3E6130";
    ctx.lineWidth = 3;

    ctxRef.current = ctx;

    // ===== 터치로 스크롤되는 것 방지 =====
    const preventScroll = (e: TouchEvent) => e.preventDefault();
    canvas.addEventListener("touchstart", preventScroll, { passive: false });
    canvas.addEventListener("touchmove", preventScroll, { passive: false });

    // 전체 화면 스크롤 잠금
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      canvas.removeEventListener("touchstart", preventScroll);
      canvas.removeEventListener("touchmove", preventScroll);
      document.body.style.overflow = original;
    };
  }, []);

  // ============================
  //   좌표 계산
  // ============================
  const getPos = (e: any) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();

    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;

    return { x: x - rect.left, y: y - rect.top };
  };

  // ============================
  //   그리기 시작
  // ============================
  const startDraw = (e: any) => {
    e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    // undo 저장
    undoStackRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    redoStackRef.current = [];

    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);

    setIsDrawing(true);
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    e.preventDefault();

    const { x, y } = getPos(e);
    ctxRef.current?.lineTo(x, y);
    ctxRef.current?.stroke();
  };

  const stopDraw = () => {
    setIsDrawing(false);
    ctxRef.current?.closePath();
  };

  // ============================
  //        도구 기능
  // ============================
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    undoStackRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    redoStackRef.current = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const undo = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    if (undoStackRef.current.length === 0) return;

    redoStackRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    const prev = undoStackRef.current.pop();
    if (prev) ctx.putImageData(prev, 0, 0);
  };

  const redo = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    if (redoStackRef.current.length === 0) return;

    undoStackRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    const next = redoStackRef.current.pop();
    if (next) ctx.putImageData(next, 0, 0);
  };

  // ============================
  //     업로드 API
  // ============================
  const handleSubmit = async () => {
    if (!userId) return alert("로그인 정보가 없습니다.");

    const canvas = canvasRef.current;
    if (!canvas) return alert("그림이 없습니다!");

    canvas.toBlob(async (blob) => {
      if (!blob) return alert("이미지 변환 실패!");

      const formData = new FormData();
      // 🔥 Swagger에서 요구하는 정확한 필드명
      formData.append("file", blob, "drawing.png");

      try {
        await diaryApi.uploadDrawing(userId, date, formData);
        alert("그림 등록 완료!");
        navigate(`/diary/detail/${date}`);
      } catch (err) {
        console.error(err);
        alert("등록 실패 (403 발생 — 필드명/file 확인 필요)");
      }
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#FDFFF9] px-6 pt-8 pb-20 max-w-md mx-auto">

      {/* 헤더 */}
      <div className="flex items-center justify-between mb-5">
        <button onClick={() => navigate(-1)} className="text-xl">←</button>
        <p className="text-[18px] font-semibold text-[#2F2F2F]">그림 일기</p>
        <button className="text-xl">☰</button>
      </div>

      {/* 그림 박스 */}
      <div className="relative w-full">
        <div className="bg-[#E8F4E8] rounded-3xl mt-12 px-6 pt-16 pb-10 min-h-[520px] shadow-md">

          <img src={turtle} className="absolute -top-6 left-2 w-20" />

          <div className="absolute top-6 right-6 flex gap-3 opacity-80 z-10">
            <img src={arrowleft} className="w-6 cursor-pointer" onClick={undo} />
            <img src={eraser} className="w-6 cursor-pointer" onClick={clearCanvas} />
            <img src={arrowright} className="w-6 cursor-pointer" onClick={redo} />
          </div>

          <canvas
            ref={canvasRef}
            className="w-full h-[420px] bg-[#E8F4E8] rounded-xl touch-none"
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={stopDraw}
            onMouseLeave={stopDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={stopDraw}
          />
        </div>
      </div>

      {/* 등록 버튼 */}
      <button
        onClick={handleSubmit}
        className="w-full bg-[#9CD841] py-3 rounded-xl text-white font-semibold text-[16px] mt-10 shadow"
      >
        그림 등록
      </button>
    </div>
  );
}
