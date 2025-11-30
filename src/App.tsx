// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import MainPage from "./pages/MainPage";
import DiaryWritePage from "./pages/DiaryWritePage";
import FileUploadPage from "./pages/FileUploadPage";
import DiaryDrawPage from "./pages/DiaryDrawPage";
import MyPage from "./pages/MyPage";
import SettingsPage from "./pages/SettingsPage";
import DiaryDetailPage from "./pages/DiaryDetailPage";

import Splash2 from "./pages/Splash2";
import AuthCallback from "./pages/AuthCallback";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* 첫 화면 */}
        <Route path="/" element={<Splash2 />} />

        {/* 카카오 로그인 콜백 */}
        <Route path="/auth/kakao/callback" element={<AuthCallback />} />

        {/* ⭐ MainLayout 적용되는 페이지들 */}
        <Route element={<MainLayout />}>
          <Route path="/home" element={<MainPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* 날짜 상세 페이지도 포함 */}
          <Route path="/diary/detail/:date" element={<DiaryDetailPage />} />
        </Route>

        {/* ⭐ MainLayout 필요 없는 단독 페이지들 */}
        <Route path="/diary/write" element={<DiaryWritePage />} />
        <Route path="/file-upload" element={<FileUploadPage />} />
        <Route path="/diary/draw" element={<DiaryDrawPage />} />
      </Routes>
    </Router>
  );
}
