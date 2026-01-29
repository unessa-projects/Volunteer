import React from "react";
import { useNavigate } from "react-router-dom";

const Page1 = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/page3");
  };

  return (
    <div className="min-h-screen bg-[#F4F9F8] bg-cover bg-center flex flex-col items-center justify-center px-4 sm:px-6 md:px-10 lg:px-16 py-8 sm:py-12">
  
      {/* Logo - now relative and positioned naturally */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <img
          src="/llogo.png"
          alt="Unessa Foundation Logo"
          className="object-contain w-16 sm:w-20 md:w-24 lg:w-28 h-auto opacity-95 drop-shadow-md hover:opacity-100 transition duration-300"
        />
      </div>
  
      {/* Text and Button Section */}
      <div className="text-center max-w-[95%] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full flex flex-col gap-6 sm:gap-8 md:gap-10 lg:gap-12">
  
        {/* Paragraph 1 */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-[#333333] leading-relaxed">
          <span className="font-bold block mb-2">Step Into Purpose. Speak for Change.</span>
          Join a powerful movement to uplift <span className="font-bold">1500+ underprivileged children</span> through
          <span className="font-bold"> quality education, emotional wellness,</span> and 
          <span className="font-bold"> self-expression</span>.
        </p>
  
        {/* Paragraph 2 */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-[#333333] leading-relaxed">
          This isn’t just an internship—it’s your chance to
          <span className="font-bold"> build real-world impact,</span> master the
          <span className="font-bold"> skill of storytelling,</span> and become the
          <span className="font-bold"> voice that drives transformation in the 21st century.</span>
        </p>
  
        {/* Paragraph 3 */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-[#333333] leading-relaxed">
          <span className="font-bold">💙 Let your journey of impact begin now.</span>
        </p>
  
        {/* CTA Button */}
        <button
          onClick={handleNext}
          className="bg-[#21B6A8] hover:bg-[#1ca496] transition duration-300 text-white
                     text-base sm:text-lg md:text-xl font-bold
                     py-3 sm:py-4 px-6 sm:px-10
                     rounded-xl sm:rounded-2xl shadow-md hover:scale-105"
        >
          I'm In
        </button>
      </div>
    </div>
  );
  
  
};

export default Page1;
