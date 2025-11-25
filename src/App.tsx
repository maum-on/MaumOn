import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import MainPage from "./pages/MainPage";
import DiaryWritePage from "./pages/DiaryWritePage";
import FileUploadPage from "./pages/FileUploadPage";
import DiaryDrawPage from "./pages/DiaryDrawPage";
import MyPage from "./pages/MyPage";
import SettingsPage from "./pages/SettingsPage";

import Splash2 from "./pages/Splash2";
import AuthCallback from "./pages/AuthCallback";

export default function App() {
  return (
    <Router>
      <Routes>

        {/* ✔ 첫 화면 = Splash2 */}
        <Route path="/" element={<Splash2 />} />

        {/* ✔ 카카오 로그인 성공 후 이동하는 페이지 */}
        <Route path="/auth/kakao/callback" element={<AuthCallback />} />

        {/* ✔ MainLayout 적용되는 메인 홈 + 메뉴바텀시트가 필요한 모든 페이지 */}
        <Route element={<MainLayout />}>
          <Route path="/home" element={<MainPage />} />

          {/* 메뉴바텀시트에서 이동할 페이지들 */}
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* ❌ 레이아웃 없이 단독 페이지 */}
        <Route path="/diary/write" element={<DiaryWritePage />} />
        <Route path="/file-upload" element={<FileUploadPage />} />
        <Route path="/diary/draw" element={<DiaryDrawPage />} />

      </Routes>
    </Router>
  );
}
