import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Page5 = () => {
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState(false);

  const handleYes = () => {
    navigate("/dashboard");
  };

  const handleNo = () => {
    setShowMessage(true);
  };

  return (
    <div className="min-h-screen bg-[#F4F9F8] bg-cover bg-center flex flex-col items-center justify-center px-4 sm:px-6 py-6">
      {/* Logo */}
      <div className="mb-10 sm:mb-12 md:mb-14 flex justify-center">
        <img
          src="/llogo.png"
          alt="Unessa Foundation Logo"
          className="object-contain w-16 sm:w-20 md:w-24 lg:w-28 h-auto opacity-95 drop-shadow-md hover:opacity-100 transition duration-300"
        />
      </div>
  
      {/* Main Content Box */}
      <div className="text-center w-full max-w-[95%] sm:max-w-[90%] md:max-w-xl lg:max-w-2xl xl:max-w-3xl px-4 sm:px-6 md:px-10 flex flex-col gap-6 sm:gap-8">
        
        {/* Heading */}
        <h1 className="text-[#333333] text-2xl sm:text-3xl md:text-4xl font-bold leading-snug">
          Would you like to sign up for this Internship?
        </h1>
  
        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          <button
            onClick={handleYes}
            className="bg-[#1ca496] text-white
                     px-6 sm:px-8 py-3 sm:py-4
                     rounded-lg sm:rounded-xl
                     text-base sm:text-lg md:text-xl font-semibold
                     hover:bg-[#21B6A8] hover:scale-105
                     transition duration-300"
          >
            Yes
          </button>
  
          <button
            onClick={handleNo}
            className="bg-gray-400 text-white
                     px-6 sm:px-8 py-3 sm:py-4
                     rounded-lg sm:rounded-xl
                     text-base sm:text-lg md:text-xl font-semibold
                     hover:bg-gray-500 hover:scale-105
                     transition duration-300"
          >
            No
          </button>
        </div>
  
        {/* Error Message */}
        {showMessage && (
          <p className="text-red-600 text-base sm:text-lg md:text-xl font-semibold">
            You can’t move forward.
          </p>
        )}
      </div>
    </div>
  );
  
};

export default Page5;
