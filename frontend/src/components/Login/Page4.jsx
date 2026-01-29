import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Page4 = () => {
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState(false);

  const handleAccept = () => {
    navigate("/page5");
  };

  const handleReject = () => {
    setShowMessage(true);
  };

  return (
    <div className="min-h-screen bg-[#F4F9F8] bg-cover bg-center flex flex-col items-center justify-center px-4 sm:px-6 py-10 sm:py-12">
  
      {/* Logo - relative and responsive */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <img
          src="/llogo.png"
          alt="Unessa Foundation Logo"
          className="object-contain w-20 sm:w-24 md:w-28 lg:w-32 h-auto opacity-95 drop-shadow-md hover:opacity-100 transition duration-300"
        />
      </div>
  
      {/* Content Box */}
      <div className="text-center w-full max-w-[95%] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl flex flex-col gap-6 sm:gap-8 px-2 sm:px-4">
  
        {/* Heading */}
        <h4 className="text-[#333333] text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-snug">
          As part of this internship, you’ll help us spread the word and raise funds.
        </h4>
  
        {/* Paragraph */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-[#333333] leading-relaxed">
          <span className="block mb-2">
            This means reaching out to your personal network, sharing our mission, and supporting the cause.
          </span>
          <span className="block">
            If you're ready to make a difference — we're excited to have you!
          </span>
        </p>
  
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
          <button
            onClick={handleAccept}
            className="bg-[#21B6A8] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg md:text-xl font-semibold
                       hover:bg-[#1ca496] hover:scale-105 transition duration-300"
          >
            I Accept
          </button>
  
          <button
            onClick={handleReject}
            className="bg-gray-400 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg md:text-xl font-semibold
                       hover:bg-gray-500 hover:scale-105 transition duration-300"
          >
            I Don’t Accept
          </button>
        </div>
  
        {/* Conditional Message */}
        {showMessage && (
          <p className="text-red-600 text-base sm:text-lg md:text-xl font-semibold">
            You can’t move forward.
          </p>
        )}
      </div>
    </div>
  );
  
  
};

export default Page4;
