import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ImpactCalculator from "./ImpactCalculator";

const Dashboard = () => {
  const navigate = useNavigate();
  const [daysLeft, setDaysLeft] = useState(30);
  const [daysSinceGenerated, setDaysSinceGenerated] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [loading, setLoading] = useState(true);

  const userEmail = localStorage.getItem("email");

  // Redirect if user is not logged in
  useEffect(() => {
    if (!userEmail) {
      navigate("/login");
    }
  }, [userEmail, navigate]);

  // Window resize listener
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate daysSinceGenerated and daysLeft using localStorage
  useEffect(() => {
    const updateDays = () => {
      const generatedAt = localStorage.getItem("generatedAt");
      if (generatedAt) {
        const startDate = new Date(generatedAt);
        const today = new Date();

        // Reset time parts to compare only dates (avoid timezone issues)
        const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        // Calculate days passed since account creation
        const diffTime = todayOnly - startDateOnly;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        console.log("Start date:", startDateOnly);
        console.log("Today:", todayOnly);
        console.log("Days since generated:", diffDays);

        setDaysSinceGenerated(diffDays);
        setDaysLeft(Math.max(0, 30 - diffDays));
      }
      setLoading(false);
    };

    updateDays();
    const interval = setInterval(updateDays, 3600000); // refresh every hour
    return () => clearInterval(interval);
  }, []);

  // Handle logout
  const handleLogout = () => {
    // Clear all localStorage items
    localStorage.removeItem("sessionExpiry");
    localStorage.removeItem("userData");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("avatar");
    localStorage.removeItem("role");
    localStorage.removeItem("quizStatus");
    localStorage.removeItem("isNewUser");
    localStorage.removeItem("hasSeenTour");
    localStorage.removeItem("googleUser");
    localStorage.removeItem("generatedAt");
    localStorage.removeItem("internshipStartDate");
    
    // Signal logout to other tabs
    localStorage.setItem("logout", Date.now().toString());
    setTimeout(() => localStorage.removeItem("logout"), 100);
    
    // Navigate to login
    navigate("/login");
  };

  // Internship journey cards
  const journeyCards = [
    {
      title: "Why this Internship",
      description: "How this experience will shape your future",
      icon: (
        <svg viewBox="0 0 64 64" className="w-6 h-6 md:w-8 md:h-8">
          <path d="M20 44V36H28V44H36V28H44V44" stroke="currentColor" strokeWidth="2" fill="none" />
          <circle cx="32" cy="20" r="4" fill="currentColor" />
        </svg>
      ),
      link: "/internship",
      color: "from-[#096d7d33] to-[#00557766]"
    },
    {
      title: "Understand Your Role",
      description: "Know your responsibilities in this internship",
      icon: (
        <svg viewBox="0 0 64 64" className="w-6 h-6 md:w-8 md:h-8">
          <circle cx="20" cy="22" r="6" fill="currentColor" />
          <rect x="14" y="32" width="12" height="12" rx="3" fill="currentColor" />
          <path d="M32 24H48M32 32H48M32 40H48" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      ),
      link: "/role",
      color: "from-[#096d7d33] to-[#00557766]"
    },
    {
      title: "Project Sneh",
      description: "Explore our flagship initiative",
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-8 md:h-8" fill="currentColor">
          <path d="M19 2H8c-1.1 0-2 .9-2 2v16c0 .6.4 1 1 1s1-.4 1-1V4h11v16H8.8l.2 1.2c.2 1.1 1.2 1.8 2.3 1.8h7.7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
        </svg>
      ),
      link: "/sneh",
      color: "from-[#096d7d33] to-[#00557766]"
    },
    {
      title: "Rewards",
      description: "Perks and bonuses await you!",
      icon: (
        <svg viewBox="0 0 64 64" className="w-6 h-6 md:w-8 md:h-8">
          <path d="M32 4L12 12V28C12 44 32 60 32 60C32 60 52 44 52 28V12L32 4Z" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M24 32L30 38L42 26" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      ),
      link: "/rewards",
      color: "from-[#096d7d33] to-[#00557766]"
    }
  ];
  console.log("📌 Journey cards loaded:", journeyCards);

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

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001F3F] to-[#003366] p-4 md:p-8">
      {/* Progress Tracker */}
      <div data-tour-id="tour-progress" className="mb-8 bg-[#ffffff10] backdrop-blur-sm rounded-xl p-4 border border-[#ffffff10]">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-white font-medium">Internship Progress</h3>
          <span className="text-[#ECA90E] font-bold">{daysLeft} days remaining</span>
        </div>
        <div className="w-full bg-[#ffffff20] rounded-full h-2.5">
          <div
            className="bg-[#ECA90E] h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (daysSinceGenerated / 30) * 100)}%` }}
          ></div>
        </div>
        <div className="mt-4 text-white">
          <p>
            Account created {daysSinceGenerated === 0 ? 'today' : `${daysSinceGenerated} day${daysSinceGenerated > 1 ? 's' : ''} ago`}
          </p>
          <span className="text-[#ECA90E] font-bold">
            {daysLeft} day{daysLeft !== 1 ? 's' : ''} remaining
          </span>
          <p className="text-sm text-gray-400 mt-2">
            Start date: {localStorage.getItem("generatedAt") ? new Date(localStorage.getItem("generatedAt")).toLocaleDateString() : 'Not set'}
          </p>
        </div>
      </div>

      <div data-tour-id="tour-impact">
        <ImpactCalculator />
      </div>

      {/* Internship Journey */}
      <section className="my-10">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-6 md:mb-8">
          Your Internship Journey
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
          {journeyCards.map((card, index) => (
            <Link
              key={index}
              to={card.link}
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
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Credentials */}
      <section className="my-10">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-6 md:mb-8">
          Our Credentials
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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

      {/* Social Icons */}
      <section className="my-8 flex justify-center items-center space-x-6">
        {/* WhatsApp */}
        <a
          href="https://wa.me/916363198779"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="text-[#25D366] hover:text-[#128C7E] transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 sm:w-10 sm:h-10"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12.04 0C5.49 0 .15 5.34.15 11.89c0 2.1.55 4.14 1.59 5.94L.06 24l6.31-1.65a11.88 11.88 0 005.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89a11.82 11.82 0 00-3.48-8.41A11.82 11.82 0 0012.04 0zm0 21.55a9.87 9.87 0 01-5.03-1.38l-.36-.21-3.74.98.99-3.65-.23-.37a9.86 9.86 0 01-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88a9.86 9.86 0 016.99 2.9 9.82 9.82 0 012.89 6.99c0 5.45-4.44 9.88-9.89 9.88zm5.43-7.17c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z" />
          </svg>
        </a>

        {/* Instagram */}
        <a
          href="https://www.instagram.com/unessafoundation/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="text-[#E1306C] hover:text-[#C13584] transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 sm:w-10 sm:h-10"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85 0 3.2-.01 3.58-.07 4.85-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07-3.2 0-3.58-.01-4.85-.07-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85 0-3.2.01-3.58.07-4.85.15-3.23 1.66-4.77 4.92-4.92 1.27-.06 1.65-.07 4.85-.07zm0-2.16C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12c0 3.26.01 3.67.07 4.95.2 4.36 2.62 6.78 6.98 6.98 1.28.06 1.69.07 4.95.07 3.26 0 3.67-.01 4.95-.07 4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95 0-3.26-.01-3.67-.07-4.95-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zm0 10.16a4 4 0 110-8 4 4 0 010 8zm6.41-11.85a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" />
          </svg>
        </a>

        {/* LinkedIn */}
        <a
          href="https://www.linkedin.com/company/unessafoundation/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="text-[#0077B5] hover:text-[#005582] transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 sm:w-10 sm:h-10"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M22.23 0H1.77C.79 0 0 .77 0 1.73v20.55c0 .95.79 1.72 1.77 1.72h20.45c.98 0 1.78-.77 1.78-1.72V1.73C24 .77 23.21 0 22.23 0zM7.12 20.45H3.56V9h3.56v11.45zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zm15.33 13.02h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.44-2.14 2.94v5.67h-3.55V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28z" />
          </svg>
        </a>
      </section>
    </div>
  );
};

export default Dashboard;
