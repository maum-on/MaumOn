import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import { useState } from "react";
import BottomSheet from "../components/BottomSheet";    // 날짜 클릭용
import MenuBottomSheet from "../components/MenuBottomSheet"; // 메뉴 버튼용 바텀시트

export default function MainLayout() {
  const location = useLocation();
  const hideHeader = location.pathname.startsWith("/diary");

  // 달력 바텀시트
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  // 메뉴 바텀시트
  const [isMenuSheetOpen, setIsMenuSheetOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#FDFFF9] flex flex-col overflow-x-auto">

      {/* Header에 메뉴 열기 함수 전달 */}
      {!hideHeader && <Header openMenu={() => setIsMenuSheetOpen(true)} />}

      {/* 페이지 + 날짜 클릭 바텀시트 핸들러 전달 */}
      <div className="flex-1 w-full overflow-auto">
        <Outlet context={{ setIsBottomSheetOpen }} />
      </div>

      {/* 날짜 바텀시트 */}
      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
      />

      {/* 메뉴 바텀시트 */}
      <MenuBottomSheet
        isOpen={isMenuSheetOpen}
        onClose={() => setIsMenuSheetOpen(false)}
      />
    </div>
  );
}
