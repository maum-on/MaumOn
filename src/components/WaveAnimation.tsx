import { useEffect, useState } from "react";

export default function WaveAnimation() {
  const [heights, setHeights] = useState([8, 16, 26, 18, 10]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeights([
        8 + Math.random() * 10,
        16 + Math.random() * 12,
        26 + Math.random() * 14,
        16 + Math.random() * 12,
        8 + Math.random() * 10,
      ]);
    }, 180);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-end gap-2 justify-center mt-3">
      {heights.map((h, i) => (
        <div
          key={i}
          style={{
            height: h,
            transition: "height 0.18s ease",
          }}
          className="w-[6px] bg-[#6ED39A] rounded-full"
        />
      ))}
    </div>
  );
}
