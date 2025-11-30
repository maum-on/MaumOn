// src/pages/MyPage.tsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import turtle from "../assets/turtle.svg";
import { diaryApi } from "../../apis/diaryApi";

export default function MyPage() {
  const navigate = useNavigate();

  const userId = Number(localStorage.getItem("userId"));

  const [loading, setLoading] = useState(true);
  const [mypageData, setMypageData] = useState<any>(null);

  // ============================
  //       마이페이지 API
  // ============================
  const fetchMyPage = async () => {
    try {
      const res = await diaryApi.mypage(userId);

      console.log("마이페이지 결과:", res.data);

      setMypageData(res.data.data); // 백엔드가 {data: {...}} 형태 리턴함
    } catch (err) {
      console.error(err);
      alert("마이페이지 정보를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchMyPage();
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#FDFFF9]">
        로딩 중...
      </div>
    );
  }

  if (!mypageData) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#FDFFF9]">
        아무 기록이 없습니다.
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#FDFFF9] pt-10 pb-20 px-6 max-w-md mx-auto">

      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="text-xl">←</button>
        <p className="text-[18px] font-semibold text-[#2F2F2F]">마이페이지</p>
        <div className="w-6" />
      </div>

      {/* 프로필 */}
      <section className="bg-[#E8F4E8] rounded-3xl p-6 shadow-inner mb-8">
        <div className="flex items-center gap-4">
          <img src={turtle} className="w-16" />
          <div>
            <p className="text-[17px] font-semibold text-[#1F3A1D]">
              {mypageData.nickname ?? "사용자"}님 안녕하세요 :)
            </p>
            <p className="text-sm text-gray-600">
              {mypageData.email ?? "이메일 없음"}
            </p>
          </div>
        </div>
      </section>

      {/* 활동 정보 */}
      <section className="space-y-4 mb-10">
        <p className="text-[16px] font-semibold text-gray-700">나의 활동</p>

        <div className="bg-white rounded-2xl p-5 shadow-sm flex justify-between">
          <span className="text-gray-700">이번달 일기 수</span>
          <span className="font-semibold text-[#4CAF50]">
            {mypageData.diaryCount ?? 0}개
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm flex justify-between">
          <span className="text-gray-700">이번달 마음 온도 평균</span>
          <span className="font-semibold text-[#4CAF50]">
            {mypageData.moodAvg ?? "-"}°C
          </span>
        </div>
      </section>

      {/* 설정 */}
      <section className="space-y-4">
        <p className="text-[16px] font-semibold text-gray-700">설정</p>

        <button className="w-full bg-white text-left p-5 rounded-2xl shadow-sm">
          알림 설정
        </button>

        <button className="w-full bg-white text-left p-5 rounded-2xl shadow-sm">
          개인정보 및 보안
        </button>

        <button
          onClick={() => {
            localStorage.clear();
            alert("로그아웃 되었습니다.");
            navigate("/");
          }}
          className="w-full bg-white text-left p-5 rounded-2xl shadow-sm text-red-500"
        >
          로그아웃
        </button>
      </section>

    </div>
  );
}
