import { useEffect, useState } from "react";

const topics = [
  "Health",
  "Education",
  "Women Empowerment",
  "Environment",
  "Food Security",
  "Disaster Relief",
];

export default function AutoSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % topics.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#096D7D] py-4 px-2">
      <div className="max-w-md mx-auto text-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          Uneesa Projects
        </h2>
      </div>

      {/* Sliding Bar */}
      <div className="w-full flex justify-center overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {topics.map((topic, index) => (
            <div key={index} className="min-w-full flex justify-center">
              <span className="bg-white text-[#043238] text-sm sm:text-base font-medium px-6 py-2 rounded-full shadow hover:shadow-md transition duration-300">
                {topic}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
