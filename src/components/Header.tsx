import logo from "../assets/logo.png";

type HeaderProps = {
  openMenu: () => void;
};

export default function Header({ openMenu }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-8 w-full h-[60px] bg-[#FDFFF9] mt-6">
      <img src={logo} alt="마음온 로고" className="h-full object-contain" />

      <button
        onClick={openMenu}
        className="text-2xl bg-white shadow p-2 rounded-lg"
      >
        ☰
      </button>
    </header>
  );
}
