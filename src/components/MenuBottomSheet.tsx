import { useNavigate } from "react-router-dom";
import { authApi } from "../../apis/authApi";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MenuBottomSheet({ isOpen, onClose }: Props) {
  const navigate = useNavigate();

  // 🔥 로그아웃
  const handleLogout = async () => {
    try {
      onClose();
      await authApi.logout();

      localStorage.removeItem("accessToken");
      localStorage.removeItem("kakaoAccessToken");
      localStorage.removeItem("userId");

      alert("로그아웃 되었습니다.");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  // 🔥 회원 탈퇴
  const handleWithdraw = async () => {
    const confirmDelete = window.confirm(
      "정말 탈퇴하시겠어요?\n작성한 일기와 정보가 모두 삭제됩니다."
    );

    if (!confirmDelete) return;

    try {
      onClose();

      await authApi.withdraw(); // 회원탈퇴 API 호출

      // 🔥 로컬스토리지 전체 정리
      localStorage.removeItem("accessToken");
      localStorage.removeItem("kakaoAccessToken");
      localStorage.removeItem("userId");

      alert("회원 탈퇴가 완료되었습니다.");

      window.location.href = "/"; // 메인 이동
    } catch (err) {
      console.error(err);
      alert("회원 탈퇴 중 오류가 발생했습니다.");
    }
  };

  const items = [
    {
      label: "👤 마이페이지",
      onClick: () => {
        onClose();
        navigate("/mypage");
      },
    },

    {
      label: "🚪 로그아웃",
      textClass: "text-red-500",
      onClick: handleLogout,
    },

    {
      label: "❌ 회원 탈퇴하기",
      textClass: "text-red-500" ,
      onClick: handleWithdraw,
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
                <span className={`text-gray-700 ${item.textClass || ""}`}>
                  {item.label}
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
