import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { io as ioClient } from "socket.io-client";

const FullCircleProgressBar = ({ percentage }) => {
  const radius = 80;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <svg height={radius * 2} width={radius * 2}>
      <circle
        stroke="#334155"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke="url(#glowGradient)"
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        style={{ transition: "stroke-dashoffset 1s ease-out" }}
      />
      <defs>
        <linearGradient id="glowGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#eca90e" />
        </linearGradient>
      </defs>
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="#ECA90E"
        fontSize="40"
        fontWeight="bold"
      >
        {percentage}%
      </text>
    </svg>
  );
};

const ImpactCalculator = () => {
  const [progress, setProgress] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [copied, setCopied] = useState(false);
  const target = 36000;

  const animationIntervalId = useRef(null);

  const animateProgress = (calculated) => {
    if (animationIntervalId.current) {
      clearInterval(animationIntervalId.current);
    }

    let start = 0;
    setProgress(0);

    animationIntervalId.current = setInterval(() => {
      start++;
      setProgress(start);
      if (start >= calculated) {
        clearInterval(animationIntervalId.current);
        animationIntervalId.current = null;
      }
    }, 15);
  };

  const fetchAndAnimate = async () => {
  try {
    let username = null;

    console.log("🔹 Fetching user from localStorage...");
    const storedUser = localStorage.getItem("googleUser");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    username = parsedUser?.username || localStorage.getItem("username");

    console.log("🔹 Username from localStorage:", username);

    if (!username) {
      const email = parsedUser?.email || localStorage.getItem("email");
      console.log("🔹 Email to fetch username from backend:", email);
      if (email) {
        const userRes = await axios.get(`https://api./api/users/${email}`);
        username = userRes.data.username;
        console.log("✅ Fetched username from backend:", username);
        localStorage.setItem("username", username);
      }
    }

    if (!username) {
      console.log("❌ No username found");
      setTotalAmount(0);
      setProgress(0);
      return;
    }

    console.log("🔹 Fetching donations for username:", username);
    const res = await axios.get("http://localhost:5000/api/donations", {
      params: { username }
    });

    const total = Array.isArray(res.data)
      ? res.data.reduce((sum, payment) => sum + payment.amount, 0)
      : 0;

    console.log(`💰 Total donations for ${username}: ₹${total}`);
    setTotalAmount(total);
    localStorage.setItem("donationAmount", JSON.stringify({ amount: total }));

    const calculated = Math.min(Math.round((total / target) * 100), 100);
    console.log("🔹 Calculated progress %:", calculated);
    animateProgress(calculated);
  } catch (err) {
    console.error("❌ Error fetching donations:", err);
  }
};

   useEffect(() => {
    fetchAndAnimate(); // Initial load

    // 🔌 Connect to backend Socket.IO server
    const socket = ioClient("http://localhost:5000/");

    socket.on("connect", () => console.log("✅ Socket connected:", socket.id));

    socket.on("paymentSuccess", (data) => {
      console.log("💵 New payment received:", data);
      // Optional: check if this payment belongs to the logged-in user
      fetchAndAnimate();
    });

      return () => {
      if (animationIntervalId.current) {
        clearInterval(animationIntervalId.current);
      }
      socket.disconnect();
    };
  }, []);

const handleCopyLink = () => {
  const baseURL = `${window.location.origin}/form`;
  const refName = localStorage.getItem("username") || "";
  const finalURL = `${baseURL}?ref=${encodeURIComponent(refName)}`;

  console.log("🖱 Copy link clicked");
  console.log("🔹 Base URL:", baseURL);
  console.log("🔹 Ref name:", refName);
  console.log("🔹 Final URL:", finalURL);

  navigator.clipboard.writeText(finalURL);
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);

  console.log("✅ URL copied to clipboard, redirecting...");
    // window.location.href = finalURL;
};

const handleShare = () => {
  const baseURL = `${window.location.origin}/form`;
  const refName = localStorage.getItem("username") || "";
  const finalURL = `${baseURL}?ref=${encodeURIComponent(refName)}`;

  console.log("🖱 Share button clicked");
  console.log("🔹 Base URL:", baseURL);
  console.log("🔹 Ref name:", refName);
  console.log("🔹 Final URL:", finalURL);

  const message = `*Hello!* 👋 I’m volunteering with *Unessa Foundation*, an NGO based in Vadodara, dedicated to transforming the lives of underprivileged children through education 📚, mentorship 🤝, and life skills 💡.🎓 

*Project Sneh* is our flagship initiative that supports children from orphanages, low-income families 💛, and rural villages — giving them not just schooling, but the tools and confidence to thrive in life.

🌍 *Our 5-Year Vision by 2030:*
✅ Empower 10,000+ children across India
✅ Ensure zero child exits into poverty mindset from shelter homes

🔗 *Donate now:* ${finalURL}`;
  const whatsappURL = `https://api.whatsapp.com/send/?text=${encodeURIComponent(message)}`;

  console.log("🔹 WhatsApp URL:", whatsappURL);
  window.open(whatsappURL, "_blank");
};


  return (
    <div className="flex flex-col md:flex-row bg-[#096d7d33] shadow-lg overflow-hidden text-white p-9 md:p-10">
      {/* Left Section */}
      <div className="md:w-1/2 w-full flex flex-col justify-center items-start gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold">Your Impact Calculator</h2>
        <p className="text-lg">
          You're <span className="font-semibold">{progress}%</span> closer to your impact goal.
        </p>
        <p className="text-lg">
          ₹{totalAmount} <span className="opacity-70">raised of</span> ₹{target}
        </p>
        <div className="flex flex-wrap gap-4 mt-4">
          <button
            onClick={handleCopyLink}
            className="bg-[#ECA90E] px-5 py-2 rounded-md font-medium hover:scale-105 hover:shadow-xl transition"
          >
            Copy Link
          </button>
          <button
            onClick={handleShare}
            className="bg-green-600 px-5 py-2 text-white rounded-md font-medium hover:scale-105 hover:shadow-xl transition"
          >
            Share on WhatsApp
          </button>
        </div>
        {copied && <span className="text-green-300 text-sm mt-2">✅ Link copied to clipboard!</span>}
      </div>

      {/* Right Section */}
      <div className="md:w-1/2 w-full flex text-[#ECA90E] justify-center items-center mt-8 md:mt-0">
        <div className="w-[180px] h-[180px] text-[#ECA90E]">
          <FullCircleProgressBar percentage={progress} />
        </div>
      </div>
    </div>
  );
};

export default ImpactCalculator;
