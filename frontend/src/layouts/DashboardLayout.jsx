import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useNavigate, useLocation, Link, Outlet } from "react-router-dom";
import { Plus, Home, BarChart2, Search, Users, DollarSign, LogOut, X, Menu, Download, CheckCircle, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import QuizOverlay from "../components/dashboard/QuizOverlay";
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';

// A new component for the quiz prompt
const QuizPrompt = ({ onStartQuiz, onDismiss }) => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      className="fixed bottom-24 lg:bottom-10 right-4 z-[100] bg-[#06444f] text-white p-4 rounded-lg shadow-2xl max-w-sm flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <CheckCircle size={24} className="text-[#FFB823]" />
          Tour Complete!
        </h3>
        <button onClick={onDismiss} className="text-gray-400 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>
      <p className="text-sm">
        Ready to test your knowledge? Take a quick quiz to earn your first certificate! You can always come back to it later.
      </p>
      <div className="flex gap-2">
        <motion.button
          onClick={onStartQuiz}
          className="flex-1 bg-[#ECA90E] text-[#043238] font-bold py-2 px-4 rounded-lg transition-all hover:bg-[#d6990d]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Take Quiz Now
        </motion.button>
        <motion.button
          onClick={onDismiss}
          className="flex-1 bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-all hover:bg-gray-700"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Maybe Later
        </motion.button>
      </div>
    </motion.div>
  );
};

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("googleUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Fetches the complete, up-to-date user profile ONCE on page load
  useEffect(() => {
    // Get the email directly from localStorage. This is more reliable.
    const userEmail = JSON.parse(localStorage.getItem("googleUser"))?.email;

    if (userEmail) {
      const fetchUpdatedUser = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/users/get-user/${userEmail}`);
          
          if (!response.ok) {
            throw new Error(`Failed to fetch user data. Status: ${response.status}`);
          }

          const updatedUserData = await response.json();

          if (updatedUserData) {
            // Update the state with the fresh user data from the database
            setUser(updatedUserData);
            
            // Also update localStorage so the next page load is fast
            localStorage.setItem('googleUser', JSON.stringify(updatedUserData));

            // Set the 45-day session expiry
            const now = new Date();
            const expiryTime = now.getTime() + (45 * 24 * 60 * 60 * 1000);
            localStorage.setItem('sessionExpiry', expiryTime);
          }
        } catch (error) {
          console.error("Failed to fetch updated user data:", error);
          // If we can't get the user's data, it's best to log them out.
          handleLogout();
        }
      };

      fetchUpdatedUser();
    }
  }, []); // The empty [] means this runs only once when the component mounts

  const username = user?.name ? user.name.split(" ")[0] : "User";
  const avatar = user?.avatar || null;
  const [isNewUser, setIsNewUser] = useState(() => {
    return localStorage.getItem("isNewUser") !== "false";
  });
  const [showLogout, setShowLogout] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizStatus, setQuizStatus] = useState(() => localStorage.getItem("quizStatus") || "notAttempted");
  const [, setShowStartButton] = useState(true);
  const [isTourRunning, setIsTourRunning] = useState(false);
  // New state to manage the quiz prompt
  const [showQuizPrompt, setShowQuizPrompt] = useState(false);
  const tourStartedRef = useRef(false);

  // Joyride state
  const [joyrideState, setJoyrideState] = useState({
    run: false,
    steps: [],
    stepIndex: 0,
  });

  // Check for session expiration on component mount
  useEffect(() => {
    checkSessionValidity();
    
    // Set up interval to check session validity periodically
    const interval = setInterval(checkSessionValidity, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const checkSessionValidity = () => {
    const sessionExpiry = localStorage.getItem("sessionExpiry");
    if (!sessionExpiry) {
      handleLogout();
      return;
    }
    
    const now = new Date().getTime();
    if (now > parseInt(sessionExpiry)) {
      handleLogout();
    }
  };


    // This effect now just reads the user state to decide about the tour
  useEffect(() => {
  if (!user) return;

  if (user.hasSeenTour === false && !tourStartedRef.current) {
    tourStartedRef.current = true;

    const timer = setTimeout(() => {
      setJoyrideState(prev => ({
        ...prev,
        run: true,
        stepIndex: 0,
      }));
    }, 1200);

    return () => clearTimeout(timer);
  }
}, [user]);


  useEffect(() => {
    if (quizStatus === "failed") {
      setShowStartButton(false);
      const timer = setTimeout(() => setShowStartButton(true), 60000);
      return () => clearTimeout(timer);
    } else if (quizStatus === "passed") {
      setShowStartButton(false);
    }
  }, [quizStatus]);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem("googleUser");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Initialize tour steps
  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
    
    const tourSteps = isMobile
      ? [
          {
            target: '[data-tour-id="tour-avatar-mobile"]',
            content: "This is your profile avatar. Click here to manage your account and logout.",
            disableBeacon: true,
            placement: "bottom",
          },
          {
            target: '[data-tour-id="tour-home-mobile"]',
            content: "Go back to your dashboard anytime by clicking Home.",
            disableBeacon: true,
            placement: "bottom",
          },
          {
            target: '[data-tour-id="tour-insights-mobile"]',
            content: "Check analytics and insights about your impact here.",
            disableBeacon: true,
            placement: "bottom",
          },
          {
            target: '[data-tour-id="tour-donations-mobile"]',
            content: "Track and manage donations here.",
            disableBeacon: true,
            placement: "bottom",
          },
        ]
      : [
          {
            target: '[data-tour-id="tour-avatar-desktop"]',
            content: "This is your profile avatar. Click here to manage your account and logout.",
            disableBeacon: true,
            placement: "bottom",
          },
          {
            target: '[data-tour-id="tour-home-desktop"]',
            content: "Go back to your dashboard anytime by clicking Home.",
            disableBeacon: true,
            placement: "bottom",
          },
          {
            target: '[data-tour-id="tour-insights-desktop"]',
            content: "Check analytics and insights about your impact here.",
            disableBeacon: true,
            placement: "bottom",
          },
          {
            target: '[data-tour-id="tour-donations-desktop"]',
            content: "Track and manage donations here.",
            disableBeacon: true,
            placement: "bottom",
          },
        ];

        setJoyrideState(prev => ({ 
          ...prev, 
          steps: tourSteps,
          // run: isNewUser && user?.name 
        }));
        const tourSkipped = localStorage.getItem("tourSkipped") === "true";
        if (isNewUser && user?.name && !tourSkipped) {
          const timer = setTimeout(() => {
            setJoyrideState(prev => ({ ...prev, steps: tourSteps, run: true }));
          }, 2000);
          return () => clearTimeout(timer);
        }
  }, [user]);

  const handleJoyrideCallback = useCallback(async (data) => {
  const { status, type, index, action } = data;

  // ✅ HANDLE SKIP & FINISH (ONCE)
  if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
    setJoyrideState(prev => ({
      ...prev,
      run: false,
      stepIndex: 0,
    }));

    // ✅ Update frontend state immediately
    setUser(prev => prev ? { ...prev, hasSeenTour: true } : prev);

    // ✅ Persist to backend
    if (user?.email) {
      try {
        await fetch("http://localhost:5000/api/users/mark-tour-seen", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email }),
        });
      } catch (err) {
        console.error("Failed to mark tour seen", err);
      }
    }

    // ✅ Show quiz prompt
    setShowQuizPrompt(true);
    return;
  }

  // ✅ STEP NAVIGATION
  if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
    setJoyrideState(prev => ({
      ...prev,
      stepIndex: index + (action === ACTIONS.PREV ? -1 : 1),
    }));
  }
}, [user]);

  
  
  const handleStartQuiz = () => {
    setShowQuizPrompt(false);
    setShowQuiz(true);
  };
  
  const handleDismissQuizPrompt = () => {
    setShowQuizPrompt(false);
    localStorage.setItem("quizPromptDismissed", "true");
  };

  const handleLogout = () => {
    // Clear all user-related data from localStorage
    const itemsToRemove = [
      "googleUser", "quizStatus", "email", "name", "username", 
      "userId", "avatar", "role", "isNewUser", "hasSeenTour",
      "sessionExpiry", "userData"
    ];
    
    itemsToRemove.forEach(item => localStorage.removeItem(item));
    
    // Signal to other tabs that we're logging out
    localStorage.setItem("logout", Date.now().toString());
    setTimeout(() => localStorage.removeItem("logout"), 100);
    
    // Navigate to login page
    navigate("/login");
  };
  
  const handleQuizComplete = (result) => {
    setQuizStatus(result);
    localStorage.setItem("quizStatus", result);
    if (result === "passed") {
      const storedUser = localStorage.getItem("googleUser");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    }
    setShowQuiz(false);
  };

  const isActive = (path) => location.pathname === path;
  const linkClass = (path) =>
    `flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-1 lg:gap-2 w-full px-2 lg:px-6 py-3 text-xs lg:text-lg rounded-xl transition-all duration-300 ${
      isActive(path)
        ? "text-[#FFB823] bg-[#043238]/70 shadow-[0_0_20px_4px_rgba(236,169,14,0.4)] font-semibold"
        : "text-white hover:text-[#FFB823] hover:bg-[#043238]/40"
    }`;

  // Animation variants
  const sidebarVariants = {
    hidden: { x: -300, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100,
        damping: 15
      }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  const popIn = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 200,
        damping: 15
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#4A9782]">
      <Joyride
        steps={joyrideState.steps}
        run={joyrideState.run}
        stepIndex={joyrideState.stepIndex}
        callback={handleJoyrideCallback}
        continuous={true}
        scrollToFirstStep={true}
        showProgress={true}
        showSkipButton={true}
        styles={{
          options: {
            primaryColor: '#043238',
            textColor: '#ffffff',
            backgroundColor: '#06444f',
            overlayColor: 'rgba(0, 0, 0, 0.5)', 
            arrowColor: '#06444f',
          },
          buttonNext: {
            backgroundColor: '#043238',
            color: '#ffffff',
          },
          buttonBack: {
            color: '#ffffff',
          },
          buttonSkip: {
            color: '#ffffff',
          },
        }}
        disableOverlayClose={false} 
        hideCloseButton={false} 
      />
      
      <motion.header 
        className="lg:hidden flex justify-between items-center bg-[#043238] text-white p-4 shadow-md"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-[#06444f] transition-colors"
          >
            {isMobileMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
          <h1 className="text-xl font-bold">Welcome, {username} 👋</h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="group relative">
            <motion.div
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-lg cursor-pointer"
              onClick={() => setShowLogout((prev) => !prev)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              data-tour-id="tour-avatar-mobile"
            >
              {avatar && <img src={avatar} alt="avatar" className="w-full h-full object-cover" />}
            </motion.div>

            <AnimatePresence>
              {showLogout && (
                <motion.button
                  onClick={handleLogout}
                  className="absolute top-full mt-2 right-0 bg-[#4A9782] text-white px-3 py-1 rounded-md shadow-md text-sm z-10 flex items-center gap-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <LogOut size={14} /> Logout
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            <motion.aside 
              className="lg:hidden fixed top-0 left-0 h-full w-64 bg-[#06444f] border-r border-orange shadow-xl z-50 p-6 flex-col justify-between"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={sidebarVariants}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="Unessa Logo" className="w-12 h-12 object-contain" />
                    <h2 className="text-white text-lg font-bold">Unessa Foundation</h2>
                  </div>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 text-white hover:text-[#FFB823]"
                  >
                    <X size={20} />
                  </button>
                </div>

                <nav className="flex flex-col gap-2">
                  <Link data-tour-id="tour-home-mobile"
                    to="/dashboard" 
                    className={linkClass("/dashboard")}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Home size={18} /> Home
                  </Link>
                  <Link data-tour-id="tour-insights-mobile" 
                    to="/insights" 
                    className={linkClass("/insights")}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <BarChart2 size={18} /> Insights
                  </Link>
                  <Link data-tour-id="tour-donations-mobile"
                    to="/donations" 
                    className={linkClass("/donations")}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <DollarSign size={18} /> Donations
                  </Link>
                  
                  <Link 
                    to="/community" 
                    className={linkClass("/community")}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Users size={18} /> Learning
                  </Link>

                  <Link to="/certificates" className={linkClass("/certificates")}
                    onClick={() => setIsMobileMenuOpen(false)}>
                    <Download size={20} /> Download Certificates
                  </Link>
                </nav>
              </div>

              <div className="text-center mt-6">
                <motion.button
                  onClick={handleLogout}
                  className="w-full bg-[#ECA90E] shadow-[0_0_20px_4px_rgba(236,169,14,0.4)] text-white px-4 py-2 rounded-md text-sm hover:bg-[#d6990d] transition-all flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut size={16} /> Logout
                </motion.button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <motion.aside 
        className="hidden lg:flex fixed top-0 left-0 h-full w-72 bg-[#06444f] border-r border-orange shadow-xl z-50 p-6 flex-col justify-between"
        initial="hidden"
        animate="visible"
        variants={sidebarVariants}
      >
        <div>
          <motion.div 
            className="flex items-center gap-3 mb-6"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <img src="/logo.png" alt="Unessa Logo" className="w-16 h-16 object-contain" />
            <h2 className="text-white text-xl font-bold">Unessa Foundation</h2>
          </motion.div>

          <nav className="flex flex-col gap-3">
            {[
              { path: "/dashboard", icon: <Home size={20} />, label: "Home", tourId: "tour-home-desktop" },
              { path: "/insights", icon: <BarChart2 size={20} />, label: "Insights", tourId: "tour-insights-desktop" },
              { path: "/donations", icon: <DollarSign size={20} />, label: "Donations", tourId: "tour-donations-desktop" },
              { path: "/community", icon: <Users size={20} />, label: "Learning" },
              { path: "/certificates", icon: <Download size={20} />, label: "Certificates" }
            ].map((item, index) => (
              <motion.div
                key={item.path}
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ delay: index * 0.1 }}
                data-tour-id={item.tourId}
              >
                <Link to={item.path} className={linkClass(item.path)}>
                  {item.icon} {item.label}
                </Link>
              </motion.div>
            ))}
          </nav>
        </div>

        <motion.div 
          className="text-center"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={handleLogout}
            className="w-full bg-[#ECA90E] shadow-[0_0_20px_4px_rgba(236,169,14,0.4)] text-white px-4 py-2 rounded-md text-sm hover:bg-[#d6990d] transition-all flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut size={18} /> Logout
          </motion.button>
        </motion.div>
      </motion.aside>

      <div className="flex-1 lg:ml-72 min-h-screen pb-20 lg:pb-0">
        <motion.header 
          className="hidden lg:flex justify-between items-center bg-[#043238] text-white p-4 shadow-md"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <motion.h1 
            className="text-xl lg:text-3xl font-bold"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Welcome, {username} 👋
          </motion.h1>

          <div className="flex items-center gap-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              
            </motion.div>

            <motion.div 
              className="group relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div 
                className="w-10 h-10 lg:w-14 lg:h-14 rounded-full overflow-hidden border-2 border-white shadow-lg cursor-pointer"
                onClick={() => setShowLogout((prev) => !prev)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                data-tour-id="tour-avatar-desktop"
              >
                {avatar && <img src={avatar} alt="avatar" className="w-full h-full object-cover" />}
              </motion.div>

              <AnimatePresence>
                {showLogout && (
                  <motion.button
                    onClick={handleLogout}
                    className="absolute top-full mt-2 right-0 bg-[#4A9782] text-white px-3 py-1 rounded-md shadow-md text-sm z-10 flex items-center gap-1"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <LogOut size={14} /> Logout
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.header>

        <motion.main 
          className="p-4 bg-[#043238] min-h-[calc(100vh-80px)]"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <Outlet />
          {showQuiz && <QuizOverlay user={user} onComplete={handleQuizComplete} />}
          <AnimatePresence>
            {showQuizPrompt && <QuizPrompt onStartQuiz={handleStartQuiz} onDismiss={handleDismissQuizPrompt} />}
          </AnimatePresence>
        </motion.main>
      </div>

      <motion.nav 
        className="fixed bottom-0 left-0 right-0 lg:hidden bg-[#06444f] border-t border-orange shadow-lg flex justify-around items-center p-2 z-50"
        initial="hidden"
        animate="visible"
        variants={popIn}
      >
        {[
          { path: "/dashboard", icon: <Home size={20} />, label: "Home", tourId: "tour-home-mobile" },
          { path: "/insights", icon: <BarChart2 size={20} />, label: "Insights", tourId: "tour-insights-mobile" },
          { path: "/donations", icon: <DollarSign size={20} />, label: "Donations", tourId: "tour-donations-mobile" },
          { path: "/community", icon: <Users size={20} />, label: "Learning" },
        ].map((item, index) => (
          <motion.div
            key={item.path}
            initial="hidden"
            animate="visible"
            variants={popIn}
            transition={{ delay: index * 0.1 }}
            className="flex-1"
            data-tour-id={item.tourId}
          >
            <Link to={item.path} className={linkClass(item.path)}>
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          </motion.div>
        ))}
      </motion.nav>
    </div>
  );
};

export default DashboardLayout;