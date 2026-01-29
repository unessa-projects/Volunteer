import React, { useEffect, useState } from "react";
import ImpactCalculator from "./ImpactCalculator";
import { FaCertificate, FaFilePdf } from "react-icons/fa";
import { io } from "socket.io-client";

// Example credentialCards data (replace with your real data)
 // Credential cards
  const credentialCards = [
    {
      title: "12A Certificate",
      description: "Proof of credibility and transparency",
      icon: (
        <svg viewBox="0 0 64 64" className="w-6 h-6 md:w-8 md:h-8">
          <path d="M32 4L12 12V28C12 44 32 60 32 60C32 60 52 44 52 28V12L32 4Z" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      ),
      link: "/12A certificatesign.pdf",
      color: "from-[#096d7d33] to-[#00557766]"
    },
    {
      title: "80G Certificate",
      description: "Review of financial transparency",
      icon: (
        <svg viewBox="0 0 64 64" className="w-6 h-6 md:w-8 md:h-8">
          <rect x="12" y="8" width="40" height="48" rx="4" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M20 20H44M20 28H44M20 36H36" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      ),
      link: "/80G certificatesign.pdf",
      color: "from-[#096d7d33] to-[#00557766]"
    },
    {
      title: "Certificate of Incorporation",
      description: "Official registration document",
      icon: (
        <svg viewBox="0 0 64 64" className="w-6 h-6 md:w-8 md:h-8">
          <path d="M20 44V36H28V44H36V28H44V44" stroke="currentColor" strokeWidth="2" fill="none" />
          <circle cx="32" cy="20" r="4" fill="currentColor" />
        </svg>
      ),
      link: "/Certificate of Incorporationsign.pdf",
      color: "from-[#096d7d33] to-[#00557766]"
    }
  ];

const VolunteerDashboard = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Get username from localStorage
    const storedUsername = localStorage.getItem("username") || localStorage.getItem("name") || "Volunteer";
    setUsername(storedUsername);

    // Only initialize Socket.IO if needed
    let socket;
    try {
      socket = io("http://localhost:5000/", {
        transports: ["websocket", "polling"],
        autoConnect: true,
      });

      socket.on("connect", () => {
        console.log("✅ Volunteer socket connected:", socket.id);
      });

      socket.on("connect_error", (err) => {
        console.error("⚠️ Socket connection failed:", err.message);
      });

      socket.on("disconnect", (reason) => {
        console.warn("⚠️ Socket disconnected:", reason);
      });
    } catch (err) {
      console.error("⚠️ Socket initialization error:", err.message);
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-800 text-white px-4 py-8 md:px-12">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <img
          src="/logo.png"
          alt="Unessa Foundation Logo"
          className="w-32 h-auto opacity-95"
        />
      </div>

      {/* Welcome Message */}
      <div className="text-center mb-8">
        <h1 className="text-xl font-bold">Welcome, {username} 👋</h1>
        <button 
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="mt-2 px-4 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* Impact Calculator */}
      <ImpactCalculator />

      {/* Credentials */}
    <section className="my-10">
  <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-6 md:mb-8">
    Our Credentials
  </h2>
  <div className="grid grid-cols-3 gap-4 md:gap-6">
    {credentialCards.map((card, index) => (
      <a
        key={index}
        href={card.link}
        target="_blank"
        rel="noopener noreferrer"
        className={`bg-gradient-to-br ${card.color} backdrop-blur-sm rounded-xl p-4 md:p-6 border border-[#ffffff10] 
                   transition-all hover:scale-[1.02] hover:shadow-lg hover:border-[#ECA90E66] group`}
      >
        <div className="flex items-start gap-4">
          <div className="p-2 md:p-3 bg-[#ffffff15] rounded-lg group-hover:bg-[#ECA90E] transition-colors text-white">
            {card.icon}
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold text-white">{card.title}</h3>
            <p className="text-[#ffffffaa] text-sm md:text-base mt-1">{card.description}</p>
            <span className="text-xs text-[#ECA90E] mt-2 inline-block">Click to view PDF</span>
          </div>
        </div>
      </a>
    ))}
  </div>
</section>

    </div>
  );
};

export default VolunteerDashboard;
