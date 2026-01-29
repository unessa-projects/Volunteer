import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const Number = () => {
  const [number, setNumber] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault(); // prevent page refresh
    if (!/^\d{10}$/.test(number)) {
      setError("Please enter a valid 10-digit number.");
    } else {
      setError("");
      localStorage.setItem("number", number);
      console.log("Saved number:", number);
      navigate("/avatar");
    }
  };
  return (
    <div className="min-h-screen bg-[#F4F9F8] bg-cover bg-center flex flex-col items-center justify-center px-4 py-8 sm:py-12">
      {/* Logo */}
      <div className="mb-10 sm:mb-12 md:mb-16 flex justify-center">
        <img
          src="/llogo.png"
          alt="Unessa Foundation Logo"
          className="object-contain w-24 sm:w-28 md:w-32 lg:w-36 xl:w-40 h-auto opacity-95 drop-shadow-md hover:opacity-100 transition"
        />
      </div>
      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl
                   bg-transparent border-none shadow-none text-center
                   px-4 sm:px-6 md:px-8 lg:px-12
                   py-6 sm:py-8 md:py-10 lg:py-14
                   flex flex-col gap-6 sm:gap-8 md:gap-10"
      >
        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#333333]">
          Enter Your Number
        </h1>
        {/* Input */}
        <input
          type="text"
          placeholder="Enter number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className="w-full border border-gray-300 rounded-2xl
                     px-4 py-3 sm:px-5 sm:py-4 md:px-6 md:py-5
                     text-base sm:text-lg md:text-xl lg:text-2xl
                     focus:outline-none focus:ring-4 focus:ring-[#21B6A8]
                     bg-white bg-opacity-40 placeholder-gray-600 text-[#333333]"
        />
        {/* Error Text */}
        {error && (
          <p className="text-red-600 text-base sm:text-lg md:text-xl font-medium">
            {error}
          </p>
        )}
        {/* Submit Button */}
        <button
          type="submit"
          disabled={!number}
          className="bg-[#21B6A8] hover:bg-[#1CA496] transition duration-300 text-[#333333]
                     px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5
                     text-base sm:text-lg md:text-xl lg:text-2xl font-bold
                     rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit
        </button>
      </form>
    </div>
  );
};
export default Number;






