import turtle1 from "../assets/character1.png";
import turtle2 from "../assets/character2.png";
import turtle3 from "../assets/character3.png";

export default function CharacterView() {
  return (
    <div className="relative flex justify-center items-center bg-[#E6F3E6] rounded-2xl py-8">
      <img src={turtle1} className="w-16 absolute top-4 left-8 opacity-90" />
      <img src={turtle2} className="w-24 z-10" />
      <img src={turtle3} className="w-16 absolute top-4 right-8 opacity-90" />
    </div>
  );
}
