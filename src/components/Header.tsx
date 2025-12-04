import logo from "../assets/logo.svg";

type HeaderProps = {
  openMenu: () => void;
};

export default function Header({ openMenu }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-8 w-full h-[60px] bg-[#FDFFF9] mt-6">

      {/* 🔥 로고 위치 그대로 + 크게 보이도록 */}
      <img
        src={logo}
        alt="마음온 로고"
        className="h-[50px] w-auto object-contain"
        style={{ transform: "scale(1.4)", transformOrigin: "left center" }}
      />

      <button
        onClick={openMenu}
        className="text-2xl bg-white shadow p-2 rounded-lg"
      >
        ☰
      </button>
    </header>
  );
}
