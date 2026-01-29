import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const avatarList = [
  "/avatars/avatar1.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
  "/avatars/avatar4.png",
  "/avatars/avatar5.png",
  "/avatars/avatar6.png",
  "/avatars/avatar7.png",
  "/avatars/avatar8.png",
];

const Avatar = () => {
  const [selected, setSelected] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if user already has an avatar selected (from previous visits)
  useEffect(() => {
    const savedAvatar = localStorage.getItem("avatar");
    if (savedAvatar && avatarList.includes(savedAvatar)) {
      setSelected(savedAvatar);
    }
  }, []);

  const handleSelect = (avatarPath) => {
    setSelected(avatarPath);
    localStorage.setItem("avatar", avatarPath);
  };

  const handleContinue = async () => {
    if (!selected || isLoading) return;
    
    setIsLoading(true);
    setError(null);

    // Get user data from localStorage
    const name = localStorage.getItem("name") || "";
    const email = localStorage.getItem("email");
    const number = localStorage.getItem("number");
    const googleUser = JSON.parse(localStorage.getItem("googleUser") || "{}");

    // Validate required fields
    if (!email) {
      setError("Email is required. Please login again.");
      setIsLoading(false);
      return;
    }

    if (!name.trim()) {
      setError("Name is required.");
      setIsLoading(false);
      return;
    }

    // Generate username
    const baseName = name.replace(/\s+/g, "").toLowerCase();
    const randomStr = Math.random().toString(36).substring(2, 6);
    const username = `${baseName}${randomStr}`;

    // Prepare data for registration
    const userData = {
      email: email.trim().toLowerCase(),
      name: name.trim(),
      number: number?.trim() || "",
      avatar: selected,
      username,
      role: "Fundraiser_External", // Assign default role
    };

    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle different error types
        if (result.field) {
          setError(`${result.field} error: ${result.error}`);
        } else if (result.details) {
          const errorMessages = Object.values(result.details).join(', ');
          setError(`Validation errors: ${errorMessages}`);
        } else {
          setError(result.error || 'Registration failed. Please try again.');
        }
        setIsLoading(false);
        return;
      }

      // Registration successful - complete the user setup
      const registeredUser = {
        ...googleUser, // From login (has original name, email, avatar)
        ...result.user, // From backend (has database _id, username, etc.)
        email: email,  // EXPLICITLY re-add the correct email to be 100% sure
        username: result.user.username || username,
        role: result.user.role || "Fundraiser_External"
      };

      // Store user data in localStorage
      localStorage.setItem("googleUser", JSON.stringify(registeredUser));
      localStorage.setItem("username", registeredUser.username);
      localStorage.setItem("role", registeredUser.role);
      localStorage.setItem("userId", result.user.id || "");
      
      // Mark user as registered (no longer new)
      localStorage.setItem("isNewUser", "false");
      
      // Set session expiry
      const sessionExpiry = new Date().getTime() + (60 * 60 * 1000); // 1 hour
      localStorage.setItem("sessionExpiry", sessionExpiry.toString());
      
      // Create userData object for session management
      const userDataForSession = {
        email: registeredUser.email,
        name: registeredUser.name,
        role: registeredUser.role,
        userId: registeredUser.id || "",
        avatar: registeredUser.avatar
      };
      localStorage.setItem("userData", JSON.stringify(userDataForSession));
      
      console.log("User registration completed:", registeredUser);
      navigate("/page1");
      
    } catch (error) {
      console.error("Network error:", error);
      setError("Network error occurred. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F9F8] bg-cover bg-center flex flex-col items-center px-4 py-8 sm:py-10 md:py-12 relative">
      {/* Logo Section */}
      <div className="w-full flex justify-center mb-8 sm:mb-10 md:mb-12">
        <img
          src="/llogo.png"
          alt="Unessa Foundation Logo"
          className="w-16 sm:w-20 md:w-24 h-auto opacity-95 drop-shadow-md hover:opacity-100 transition"
        />
      </div>

      {/* Main Content */}
      <div className="w-full max-w-[90%] sm:max-w-2xl md:max-w-4xl lg:max-w-5xl space-y-6 sm:space-y-8">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-center text-[#333333]">
          Choose Your Avatar
        </h1>

        {/* Instructions */}
        <p className="text-center text-gray-600 text-sm sm:text-base">
          Select an avatar to represent you in the platform
        </p>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm sm:text-base">
            {error}
            <button 
              onClick={() => setError(null)}
              className="ml-4 text-red-800 font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Avatar Selection Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-6 justify-items-center">
          {avatarList.map((avatar, index) => (
            <div key={index} className="relative">
              <img
                src={avatar}
                alt={`Avatar ${index + 1}`}
                onClick={() => handleSelect(avatar)}
                className={`w-20 sm:w-24 md:w-28 h-20 sm:h-24 md:h-28 rounded-full border-4 cursor-pointer transition duration-300 ${
                  selected === avatar
                    ? "border-[#21B6A8] scale-110 shadow-md"
                    : "border-transparent hover:scale-105 hover:border-gray-300"
                }`}
              />
              {selected === avatar && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Finish Button */}
        <div className="text-center pt-4 sm:pt-6">
          <button
            className={`px-8 sm:px-10 py-3 sm:py-4 text-lg sm:text-xl font-semibold rounded-xl transition duration-300 ${
              selected && !isLoading
                ? "bg-[#21B6A8] text-white hover:bg-[#1a9c8f] shadow-md hover:shadow-lg transform hover:scale-105"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!selected || isLoading}
            onClick={handleContinue}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              "Complete Registration"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Avatar;
