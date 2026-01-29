import React from "react";
import { useNavigate } from "react-router-dom";

const Page3 = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/page4");
  };

  return (
    <div className="min-h-screen bg-[#F4F9F8] bg-cover bg-center flex flex-col items-center justify-center px-4 sm:px-6 md:px-10 py-10 sm:py-12">
  
      {/* Logo - Now relative and properly spaced */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <img
          src="/llogo.png"
          alt="Unessa Foundation Logo"
          className="object-contain w-16 sm:w-20 md:w-24 lg:w-28 h-auto opacity-95 drop-shadow-md hover:opacity-100 transition duration-300"
        />
      </div>
  
      {/* Main Card */}
      <div className="w-full max-w-[95%] sm:max-w-2xl lg:max-w-3xl text-center flex flex-col gap-6 sm:gap-8 md:gap-10 px-4 sm:px-6 md:px-8">
  
        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#333333] leading-snug">
          Be the Voice of <span className="italic">Unessa</span>
        </h1>
  
        {/* Subheading */}
        <p className="text-base sm:text-lg md:text-xl text-[#333333] font-medium leading-relaxed">
          This is more than a role — it’s a <span className="font-bold">responsibility</span> to champion hope, education, and emotional well-being for those who need it most.
        </p>
  
        {/* Disclaimer Paragraphs */}
        <p className="text-sm sm:text-base md:text-lg text-[#333333] leading-relaxed">
          If you're ready to lead with <span className="font-bold">passion, empathy, and purpose,</span> let’s create change together.
        </p>
  
        <p className="text-sm sm:text-base md:text-lg text-[#333333] leading-relaxed">
          But if you're unsure, no worries — our cause needs commitment, not half-measures.
        </p>
  
        {/* CTA Button */}
        <button
          onClick={handleNext}
          className="bg-[#21B6A8] text-white
                     px-6 py-3 sm:px-8 sm:py-4
                     rounded-xl text-base sm:text-lg md:text-xl font-semibold
                     hover:bg-[#1ca496] hover:scale-105 transition duration-300"
        >
          Yes, I’m All In
        </button>
      </div>
    </div>
  );
  
  
};

export default Page3;
