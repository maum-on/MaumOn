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

  const [isActive, setIsActive] = useState(false); // ⭐ 버튼 활성화 상태

  // ============================
  //   초기 캔버스 설정
  // ============================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    ctx.lineCap = "round";
    ctx.strokeStyle = "#3E6130";
    ctx.lineWidth = 3;

    ctxRef.current = ctx;

    // 모바일 스크롤 방지
    const preventScroll = (e: TouchEvent) => e.preventDefault();
    canvas.addEventListener("touchstart", preventScroll, { passive: false });
    canvas.addEventListener("touchmove", preventScroll, { passive: false });

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      canvas.removeEventListener("touchstart", preventScroll);
      canvas.removeEventListener("touchmove", preventScroll);
      document.body.style.overflow = original;
    };
  }, []);

  // ============================
  //   캔버스 비어있는지 체크
  // ============================
  const checkCanvasActive = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    // 하나라도 0이 아닌 픽셀이 있으면 = 그림 있음
    const hasDrawing = pixels.some((v) => v !== 0);
    setIsActive(hasDrawing);
  };

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

    undoStackRef.current.push(
      ctx.getImageData(0, 0, canvas.width, canvas.height)
    );
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

    checkCanvasActive(); // ⭐ 실시간으로 버튼 활성화
  };

  const stopDraw = () => {
    setIsDrawing(false);
    ctxRef.current?.closePath();
    checkCanvasActive(); // ⭐ 그리기 끝난 후 체크
  };

  // ============================
  //        도구 기능
  // ============================
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    undoStackRef.current.push(
      ctx.getImageData(0, 0, canvas.width, canvas.height)
    );
    redoStackRef.current = [];

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsActive(false); // 다 지우면 비활성화
  };

  const undo = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    if (undoStackRef.current.length === 0) return;

    redoStackRef.current.push(
      ctx.getImageData(0, 0, canvas.width, canvas.height)
    );
    const prev = undoStackRef.current.pop();
    if (prev) ctx.putImageData(prev, 0, 0);

    checkCanvasActive();
  };

  const redo = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    if (redoStackRef.current.length === 0) return;

    undoStackRef.current.push(
      ctx.getImageData(0, 0, canvas.width, canvas.height)
    );
    const next = redoStackRef.current.pop();
    if (next) ctx.putImageData(next, 0, 0);

    checkCanvasActive();
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
        className={`w-full py-3 rounded-xl text-[16px] font-semibold mt-10 shadow transition
          ${
            isActive
              ? "bg-[#9CD841] text-gray-700 cursor-pointer hover:bg-[#8CC23A]"
              : "bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none"
          }
        `}
      >
        그림 등록
      </button>

    </div>
  );
}
