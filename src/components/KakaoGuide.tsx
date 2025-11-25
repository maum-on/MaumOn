// src/components/KakaoGuide.tsx

import kakaoGuide1 from "../assets/kakao_guide1.png";
import kakaoGuide2 from "../assets/kakao_guide2.png";
import kakaoGuide3 from "../assets/kakao_guide3.png";
import kakaoGuide4 from "../assets/kakao_guide4.png";

type KakaoGuideProps = {
  step: number;
  setStep: (value: number) => void;
};

type GuideStep = {
  img: string;
  title: string;
  description: string;
  button: string;
};

export default function KakaoGuide({ step, setStep }: KakaoGuideProps) {
  const guides: (GuideStep | {})[] = [
    {},
    {
      img: kakaoGuide1,
      title: "분석할 채팅방으로 이동",
      description:
        "분석하고 싶은 채팅방에 들어간 후\n우측 상단의 메뉴(≡)를 눌러주세요",
      button: "다음 단계",
    },
    {
      img: kakaoGuide2,
      title: "채팅방 설정으로 이동",
      description:
        "우측 상단의 설정 아이콘(톱니바퀴)을 눌러\n'채팅방 설정'으로 이동하세요",
      button: "다음 단계",
    },
    {
      img: kakaoGuide3,
      title: "대화 내용 내보내기",
      description:
        "채팅방 설정 맨 아래에 있는\n'대화 내용 내보내기' 메뉴를 선택하세요",
      button: "다음 단계",
    },
    {
      img: kakaoGuide4,
      title: "텍스트 파일로 내보내기",
      description: "'텍스트 메시지만 보내기' 옵션을 선택하세요",
      button: "다음 단계",
    },
    {
      title: "파일 전송",
      description:
        "이메일 주소를 입력하여 파일을 전송하세요\n메일이 오면 .txt 파일을 다운로드해서\n위의 파일 등록 화면에서 업로드해주세요!",
      button: "확인했어요!",
    },
  ];

  const current = guides[step] as GuideStep;

  return (
    <div className="w-full min-h-screen bg-[#FAFAF0] pt-8 pb-20 px-6 max-w-md mx-auto">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-5">
        <button onClick={() => setStep(0)} className="text-xl">
          ←
        </button>
        <p className="text-[18px] font-semibold text-[#2F2F2F]">
          카카오톡 · 모바일 가이드
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

        {/* 버튼 */}
        <button
          onClick={() => {
            if (step === 5) setStep(0); // 마지막 단계 → 파일 등록 화면으로
            else setStep(step + 1);
          }}
          className="mt-6 w-full bg-[#FDFFF9] text-gray-700 py-3 rounded-xl font-semibold text-sm"
        >
          {current.button}
        </button>
      </div>
    </div>
  );
}
