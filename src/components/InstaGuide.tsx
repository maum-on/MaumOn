// src/components/InstaGuide.tsx

import instaGuide1 from "../assets/insta_guide1.svg";
import instaGuide2 from "../assets/insta_guide2.svg";
import instaGuide3 from "../assets/insta_guide3.svg";
import instaGuide4 from "../assets/insta_guide4.svg";
import instaGuide5 from "../assets/insta_guide5.svg";
import instaGuide6 from "../assets/insta_guide6.svg";

type InstaGuideProps = {
  step: number;
  setStep: (value: number) => void;
};

type GuideStep = {
  img: string;
  title: string;
  description: string;
  button: string;
};

export default function InstaGuide({ step, setStep }: InstaGuideProps) {
  // 🔥 step 100 → 1, 101 → 2 ... 106 → 7
  const realStep = step - 99;

  const guides: (GuideStep | {})[] = [
    {}, // index 0
    {
      img: instaGuide1,
      title: "내 프로필로 이동",
      description:
        "우측 하단의 내 프로필에 들어간 후\n우측 상단의 메뉴(≡)를 눌러주세요",
      button: "다음 단계",
    },
    {
      img: instaGuide2,
      title: "계정 센터로 이동",
      description: "제일 상단의 '계정 센터'를 눌러주세요",
      button: "다음 단계",
    },
    {
      img: instaGuide3,
      title: "내 정보 내보내기",
      description:
        "'내 정보 및 권한'에 들어간 후\n'내 정보 내보내기'를 눌러주세요",
      button: "다음 단계",
    },
    {
      img: instaGuide4,
      title: "정보를 내보낼 계정 선택",
      description:
        "'내보내기 만들기'를 누른 후\n정보를 내보낼 계정을 선택하세요",
      button: "다음 단계",
    },
    {
      img: instaGuide5,
      title: "내보내기 형식 지정",
      description:
        "'기기로 내보내기'를 누른 후\n정보 맞춤 설정에서 기간은 '직접 지정'으로\n형식은 'JSON'으로 설정해 주세요",
      button: "다음 단계",
    },
    {
      img: instaGuide6,
      title: "다운로드 및 첨부",
      description:
        "시간이 지나면 파일을 다운로드 해주세요\n용량에 따라 오래 걸릴 수 있어요\n내보내기가 완료되면 메일로 알려드립니다!",
      button: "확인했어요!",
    },
  ];

  const current = guides[realStep] as GuideStep;

  return (
    <div className="w-full min-h-screen bg-[#FDFFF9] pt-8 pb-20 px-6 max-w-md mx-auto">
      
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-5">
        <button onClick={() => setStep(0)} className="text-xl">
          ←
        </button>
        <p className="text-[18px] font-semibold text-[#2F2F2F]">
          인스타그램 · 모바일 가이드
        </p>
        <div />
      </div>

      {/* 내용 카드 */}
      <div className="bg-[#C6DBA29C] rounded-3xl p-6 flex flex-col min-h-[430px]">

        {/* 타이틀 */}
        <h2 className="text-[20px] font-semibold text-[#1F3A1D] mb-4">
          {current.title}
        </h2>

        {/* 이미지 */}
        <img
          src={current.img}
          className="w-full rounded-xl shadow-sm mb-6"
          alt={current.title}
        />

        {/* 설명 */}
        <p className="text-[13px] text-gray-700 font-semibold leading-relaxed whitespace-pre-line flex-1">
          {current.description}
        </p>

        {/* 버튼 그룹 */}
        <div className="flex gap-4 mt-6">
          
          {/* 🔙 이전 단계 버튼 */}
          <button
            onClick={() => {
              if (realStep === 1) setStep(0); // 첫 단계 → 파일 업로드 화면으로
              else setStep(step - 1);         // 일반 단계 → 이전 단계로
            }}
            className="w-1/2 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold text-sm"
          >
            이전 단계
          </button>

          {/* 👉 다음 단계 / 완료 버튼 */}
          <button
            onClick={() => {
              if (realStep === 6) setStep(0); // 마지막 단계
              else setStep(step + 1);
            }}
            className="w-1/2 bg-[#FDFFF9] text-gray-700 py-3 rounded-xl font-semibold text-sm"
          >
            {current.button}
          </button>
        </div>

      </div>
    </div>
  );
}
