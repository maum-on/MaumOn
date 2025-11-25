// src/components/BottomSheet.tsx
import { useNavigate } from "react-router-dom";
import write from "../assets/write.png";
import file from "../assets/file.png";
import draw from "../assets/draw.png";

// ✅ Props 타입 선언
type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function BottomSheet({ isOpen, onClose }: BottomSheetProps) {
  const navigate = useNavigate();

  const items = [
    {
      img: write,
      text: "일기쓰기",
      onClick: () => {
        onClose();
        navigate("/diary/write");
      }
    },
    {
      img: file,
      text: "파일등록",
      onClick: () => {
        onClose();
        navigate("/file-upload");
      }
    },
    {
      img: draw,
      text: "그림일기",
      onClick: () => {
        onClose();
        navigate("/diary/draw");
      }
    }
  ];

  return (
    <>
      {/* 🔹 달력을 클릭했을 때만 바텀시트 열림 */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-[10000]"
        />
      )}

      {/* 바텀시트 */}
      <div
        className={`fixed bottom-0 left-1/2 -translate-x-1/2
          w-full max-w-[480px] bg-white rounded-t-3xl shadow-xl
          transition-transform duration-300 z-[10001]
          ${isOpen ? "translate-y-0" : "translate-y-full"}
        `}
      >
        <div className="p-6">
          <p className="font-semibold text-gray-700 mb-4 text-lg">
            오늘의 일기
          </p>

          <div className="flex flex-col space-y-4">
            {items.map((item, i) => (
              <button
                key={i}
                onClick={item.onClick}
                className="w-full flex justify-between items-center bg-[#F8F8ED] rounded-2xl p-4 shadow-sm"
              >
                <span className="flex items-center gap-3">
                  <img src={item.img} alt="" className="w-10 h-10" />
                  <span className="text-gray-700">{item.text}</span>
                </span>
                <span className="text-[#4CAF50] text-xl">›</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
