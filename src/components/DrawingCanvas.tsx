import { useRef, useState, useEffect } from "react";

type DrawingCanvasProps = {
  width?: number;
  height?: number;
  onSave: (imgUrl: string) => void;
};

export default function DrawingCanvas({
  width = 300,
  height = 350,
  onSave,
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineCap = "round";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#3E6130"; // 초록 계열

    ctxRef.current = ctx;
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();

    const { offsetX, offsetY } = getEventPos(e);
    ctxRef.current?.beginPath();
    ctxRef.current?.moveTo(offsetX, offsetY);

    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = getEventPos(e);
    ctxRef.current?.lineTo(offsetX, offsetY);
    ctxRef.current?.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    ctxRef.current?.closePath();
  };

  const getEventPos = (e: any) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    return {
      offsetX: clientX - rect.left,
      offsetY: clientY - rect.top,
    };
  };

  const clearCanvas = () => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imgUrl = canvas.toDataURL("image/png");
    onSave(imgUrl);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <canvas
        ref={canvasRef}
        className="bg-[#E8F4E8] rounded-3xl shadow-md touch-none"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />

      <div className="flex gap-3 mt-2">
        <button
          className="px-4 py-2 bg-gray-200 rounded-xl text-sm"
          onClick={clearCanvas}
        >
          전체 지우기
        </button>

        <button
          className="px-4 py-2 bg-green-500 text-white rounded-xl text-sm"
          onClick={saveDrawing}
        >
          그림 저장
        </button>
      </div>
    </div>
  );
}
