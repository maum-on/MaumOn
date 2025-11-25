import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import turtle from "../assets/turtle.png";
import arrowleft from "../assets/arrowleft.png";
import eraser from "../assets/eraser.png";
import arrowright from "../assets/arrowright.png";

export default function DiaryDrawPage() {
  const navigate = useNavigate();

  // 캔버스 참조
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const undoStackRef = useRef<ImageData[]>([]);
  const redoStackRef = useRef<ImageData[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineCap = "round";
    ctx.strokeStyle = "#3E6130"; // 연한 초록
    ctx.lineWidth = 3;

    ctxRef.current = ctx;
  }, []);

  // 위치 계산
  const getPos = (e: any) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();

    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;

    return { x: x - rect.left, y: y - rect.top };
  };

  const startDraw = (e: any) => {
    // save current canvas state so we can undo this new stroke
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (canvas && ctx) {
      try {
        const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
        undoStackRef.current.push(img);
        // limit history
        if (undoStackRef.current.length > 30) undoStackRef.current.shift();
        // new action invalidates redo history
        redoStackRef.current = [];
      } catch (err) {
        // ignore (e.g. cross-origin, though unlikely here)
      }
    }

    const { x, y } = getPos(e);
    ctxRef.current?.beginPath();
    ctxRef.current?.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: any) => {
    if (!isDrawing) return;

    const { x, y } = getPos(e);
    ctxRef.current?.lineTo(x, y);
    ctxRef.current?.stroke();
  };

  const stopDraw = () => {
    setIsDrawing(false);
    ctxRef.current?.closePath();
  };

  // 지우개 버튼 연결 (전체 지우기)
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (canvas && ctx) {
      try {
        // save state for undo before clearing
        const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
        undoStackRef.current.push(img);
        if (undoStackRef.current.length > 30) undoStackRef.current.shift();
        redoStackRef.current = [];
      } catch (err) {}
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const undo = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    if (undoStackRef.current.length === 0) return;

    try {
      // push current state to redo
      const current = ctx.getImageData(0, 0, canvas.width, canvas.height);
      redoStackRef.current.push(current);

      const prev = undoStackRef.current.pop();
      if (prev) ctx.putImageData(prev, 0, 0);
    } catch (err) {
      // ignore
    }
  };

  const redo = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    if (redoStackRef.current.length === 0) return;

    try {
      const current = ctx.getImageData(0, 0, canvas.width, canvas.height);
      undoStackRef.current.push(current);

      const next = redoStackRef.current.pop();
      if (next) ctx.putImageData(next, 0, 0);
    } catch (err) {
      // ignore
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FDFFF9] px-6 pt-8 pb-20 max-w-md mx-auto">

      {/* 헤더 */}
      <div className="flex items-center justify-between mb-5 z-10 relative">
        <button onClick={() => navigate(-1)} className="text-xl">←</button>
        <p className="text-[18px] font-semibold text-[#2F2F2F]">그림 일기</p>
        <button className="text-xl">☰</button>
      </div>

      {/* 그림 박스 */}
      <div className="relative w-full">

        <div className="bg-[#E8F4E8] rounded-3xl mt-12 px-6 pt-16 pb-10 min-h-[400px] relative shadow-md">

          {/* 거북이 */}
          <img
            src={turtle}
            className="absolute -top-6 left-2 w-20 z-0 pointer-events-none"
          />

          {/* 상단 아이콘 */}
          <div className="absolute top-6 right-6 flex gap-3 opacity-80 z-10">
            <img src={arrowleft} className="w-5 cursor-pointer" onClick={undo} />
            <img
              src={eraser}
              className="w-5 cursor-pointer"
              onClick={clearCanvas}
            />
            <img src={arrowright} className="w-5 cursor-pointer" onClick={redo} />
          </div>

          {/* 캔버스 영역 */}
          <div className="flex-1 flex items-center justify-center text-gray-500 text-[15px]">
            <canvas
              ref={canvasRef}
              className="w-full h-[300px] bg-transparent"
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
      </div>

      {/* 제출 버튼 */}
      <button className="w-full bg-[#D5D5D5] py-3 rounded-xl text-gray-700 font-medium mt-10">
        그림 등록
      </button>
    </div>
  );
}
