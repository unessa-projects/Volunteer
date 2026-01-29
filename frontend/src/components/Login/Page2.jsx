import React from "react";
import { useNavigate } from "react-router-dom";

const Page2 = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/page3");
  };

  return (
    <div className="relative min-h-screen bg-[#F4F9F8] bg-cover bg-center flex flex-col items-center justify-center px-4">

  {/* Logo */}
  <div className="absolute top-6 sm:top-8 md:top-10 left-1/2 transform -translate-x-1/2">
    <img
      src="/llogo.png"
      alt="Unessa Foundation Logo"
      className="object-contain w-20 sm:w-24 md:w-28 lg:w-32 h-auto opacity-95 drop-shadow-md hover:opacity-100 transition"
    />
  </div>

  {/* Main Content */}
  <div className="relative text-center w-full max-w-4xl 
                  p-6 sm:p-10 md:p-12 lg:p-14 
                  flex flex-col gap-6 sm:gap-8 lg:gap-10 mt-28 sm:mt-32 md:mt-36">
    
    {/* Heading */}
    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#333333] leading-snug drop-shadow-md">
      We need to <span className="italic">"future-proof the next generation,"</span> <br />
      today by working on three key aspects of child development:
    </h1>

    {/* Bullet Points */}
    <ul className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#333333] font-medium space-y-1 sm:space-y-2 drop-shadow-md">
      <li>• Social Emotional Learning</li>
      <li>• Academic Support</li>
      <li>• Mental Well-being</li>
    </ul>

    {/* Button */}
    <button
      onClick={handleNext}
      className="bg-[#21B6A8] hover:bg-[#1ca496] text-[#333333]
                 px-6 sm:px-8 py-3 sm:py-4
                 text-base sm:text-lg md:text-xl font-semibold
                 rounded-xl transition duration-300 drop-shadow-lg"
    >
      Boy, That’s Deep!
    </button>

  </div>
</div>


  );
};

export default Page2;
