// src/components/MenuBottomSheet.tsx
import { useNavigate } from "react-router-dom";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MenuBottomSheet({ isOpen, onClose }: Props) {
  const navigate = useNavigate();

  const items = [
    {
      label: "👤 마이페이지",
      onClick: () => {
        onClose();
        navigate("/mypage");
      },
    },
    {
      label: "⚙️ 설정",
      onClick: () => {
        onClose();
        navigate("/settings");
      },
    },
    {
      label: "🚪 로그아웃",
      textClass: "text-red-500",
      onClick: () => {
        onClose();
        alert("로그아웃 되었습니다.");
      },
    },
  ];

  return (
    <>
      {/* 딤 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[20000]"
          onClick={onClose}
        />
      )}

      {/* 바텀시트 */}
      <div
        className={`
          fixed bottom-0 left-1/2 -translate-x-1/2
          w-full max-w-[480px]
          bg-white rounded-t-3xl shadow-xl
          transition-transform duration-300 z-[20001]
          ${isOpen ? "translate-y-0" : "translate-y-full"}
        `}
      >
        <div className="p-6 pb-10">
          <p className="font-semibold text-gray-700 mb-5 text-lg">메뉴</p>

          <div className="flex flex-col space-y-4">
            {items.map((item, i) => (
              <button
                key={i}
                onClick={item.onClick}
                className="w-full flex justify-between items-center bg-[#F8F8ED] rounded-2xl p-4 shadow-sm"
              >
                <span className="text-gray-700">
                  <span className={`${item.textClass || ""}`}>
                    {item.label}
                  </span>
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
