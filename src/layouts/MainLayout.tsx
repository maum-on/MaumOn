// src/layouts/MainLayout.tsx
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import { useState } from "react";
import BottomSheet from "../components/BottomSheet"; // 날짜 클릭용
import MenuBottomSheet from "../components/MenuBottomSheet"; // 메뉴 버튼용

export default function MainLayout() {
  const location = useLocation();
  const hideHeader = location.pathname.startsWith("/diary");

  // 달력 날짜 바텀시트
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  // 메뉴 바텀시트
  const [isMenuSheetOpen, setIsMenuSheetOpen] = useState(false);

  // ⭐ 클릭된 날짜 보관
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  return (
    <div className="min-h-screen w-full bg-[#FDFFF9] flex flex-col overflow-x-auto">

      {/* Header - 메뉴 바텀시트 오픈 핸들러 전달 */}
      {!hideHeader && <Header openMenu={() => setIsMenuSheetOpen(true)} />}

      {/* Outlet에 날짜선택 setter + 바텀시트 오픈함수 전달 */}
      <div className="flex-1 w-full overflow-auto">
        <Outlet
          context={{
            setIsBottomSheetOpen,
            setSelectedDate, // ⭐ 날짜 저장 함수 전달
          }}
        />
      </div>

      {/* 날짜 선택 → BottomSheet */}
      <BottomSheet
        isOpen={isBottomSheetOpen}
        selectedDate={selectedDate} // ⭐ 날짜 전달
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
