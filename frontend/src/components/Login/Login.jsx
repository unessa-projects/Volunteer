import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const loginInProgress = useRef(false);
  const googleInitialized = useRef(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [forceRender, setForceRender] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  // Check for existing valid session on component mount
  useEffect(() => {
    checkExistingSession();
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const checkExistingSession = useCallback(() => {
    const sessionExpiry = localStorage.getItem("sessionExpiry");
    const userData = localStorage.getItem("userData");
    
    if (sessionExpiry && userData) {
      const now = new Date().getTime();
      if (now < parseInt(sessionExpiry)) {
        setIsLoggedIn(true);
        const user = JSON.parse(userData);
        setRedirecting(true);
        setLoading(true);
        setLoadingMessage("Redirecting to your dashboard...");
        redirectUserBasedOnRole(user.role);
      } else {
        clearSession();
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleStorageChange = useCallback((e) => {
    if (e.key === "sessionExpiry" || e.key === "userData") {
      checkExistingSession();
    }
    
    if (e.key === "logout") {
      clearSession();
      navigate("/login");
    }
  }, [checkExistingSession, navigate]);

  const clearSession = useCallback(() => {
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
    setIsLoggedIn(false);
    setForceRender(prev => prev + 1);
  }, []);

  const setSession = useCallback((userData) => {
    const now = new Date().getTime();
     const expiryTime = now + 45 * 24 * 60 * 60 * 1000;
    
    localStorage.setItem("sessionExpiry", expiryTime.toString());
    localStorage.setItem("userData", JSON.stringify(userData));
    setIsLoggedIn(true);
    
    setTimeout(() => {
      if (new Date().getTime() >= expiryTime) {
        handleLogout();
      }
    }, 60 * 60 * 1000);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.setItem("logout", Date.now().toString());
    setTimeout(() => localStorage.removeItem("logout"), 100);
    clearSession();
    navigate("/login");
  }, [clearSession, navigate]);

  const parseJwt = useCallback((token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Failed to parse JWT:", e);
      return null;
    }
  }, []);

  const redirectUserBasedOnRole = useCallback((role) => {
    if (role === "Volunteer_Internal") {
      navigate("/volunteerDashboard");
    } else {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleCredentialResponse = useCallback(async (response) => {
    if (loginInProgress.current) {
      console.log("Login already in progress");
      return;
    }
    
    loginInProgress.current = true;
    setLoading(true);
    setLoadingMessage("Signing you in...");
    console.log("Google login response:", response);

    try {
      const decoded = parseJwt(response.credential);
      if (!decoded) {
        console.log("Failed to decode JWT");
        loginInProgress.current = false;
        setLoading(false);
        return;
      }

      const email = decoded.email;
      const googleUser = {
        name: decoded.name,
        email,
        avatar: decoded.picture,
      };
      localStorage.setItem("googleUser", JSON.stringify(googleUser));

      // Step 1: Check if user exists
      setLoadingMessage("Checking your account...");
      const checkRes = await fetch(
        "http://localhost:5000/api/users/check-user",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (!checkRes.ok) {
        console.error("Check user failed:", checkRes.status);
        // First-time user - set generatedAt to current date
        const defaultRole = "Fundraiser_External";
        const currentDate = new Date().toISOString();
        const userData = {
          email,
          role: defaultRole,
          isNewUser: true,
          name: decoded.name,
          avatar: decoded.picture
        };
        
        setSession(userData);
        
        localStorage.setItem("email", email);
        localStorage.setItem("name", decoded.name);
        localStorage.setItem("avatar", decoded.picture);
        localStorage.setItem("quizStatus", "notAttempted");
        localStorage.setItem("isNewUser", "true");
        localStorage.setItem("hasSeenTour", "true");
        localStorage.setItem("generatedAt", currentDate); // ✅ Set generatedAt

        console.log("Logged in user role (new user):", defaultRole);
        setLoadingMessage("Setting up your account...");
        navigate("/name");
        loginInProgress.current = false;
        setLoading(false);
        return;
      }

      const checkData = await checkRes.json();
      console.log("Check user response:", checkData);

      if (checkData.exists) {
        // Step 2: Get user details
        setLoadingMessage("Loading your profile...");
        const userRes = await fetch(
          `http://localhost:5000/api/users/get-user/${email}`
        );
        
        if (!userRes.ok) {
          throw new Error(`Failed to fetch user: ${userRes.status}`);
        }
        
        const userData = await userRes.json();
        console.log("User data fetched:", userData);

        // ✅ Store generatedAt if it exists in the response
        if (userData.generatedAt) {
          console.log("✅ Generated date found:", userData.generatedAt);
          localStorage.setItem("generatedAt", userData.generatedAt);
        } else {
          console.log("❌ Generated date not found in API response, setting current date");
          localStorage.setItem("generatedAt", new Date().toISOString());
        }

        const role = userData.role || "Fundraiser_External";

        // Store all user data in localStorage
        localStorage.setItem("email", email);
        localStorage.setItem("name", userData.name || decoded.name);
        localStorage.setItem("username", userData.username || "");
        localStorage.setItem("userId", userData._id || userData.id || decoded.sub || "");
        localStorage.setItem("avatar", userData.avatar || decoded.picture);
        localStorage.setItem("role", role);

        // Step 3: Quiz status
        setLoadingMessage("Checking your progress...");
        const quizRes = await fetch(
          `http://localhost:5000/api/users/quiz-status/${email}`
        );
        
        let quizData = { quizStatus: "notAttempted" };
        if (quizRes.ok) {
          quizData = await quizRes.json();
        }
        localStorage.setItem("quizStatus", quizData.quizStatus || "notAttempted");

        // Step 4: Product tour
        if (!localStorage.getItem("hasSeenTour")) {
          localStorage.setItem("hasSeenTour", "true");
        }

        // Set session data
        const sessionUserData = {
          email,
          name: userData.name || decoded.name,
          role,
          userId: userData._id || userData.id || decoded.sub || "",
          avatar: userData.avatar || decoded.picture,
        };
        setSession(sessionUserData);

        // Step 5: Navigate
        setLoadingMessage("Redirecting to your dashboard...");
        redirectUserBasedOnRole(role);

      } else {
        // First-time user - set generatedAt to current date
        const defaultRole = "Fundraiser_External";
        const currentDate = new Date().toISOString();
        const userData = {
          email,
          role: defaultRole,
          isNewUser: true,
          name: decoded.name,
          avatar: decoded.picture
        };
        
        setSession(userData);
        
        localStorage.setItem("email", email);
        localStorage.setItem("name", decoded.name);
        localStorage.setItem("avatar", decoded.picture);
        localStorage.setItem("quizStatus", "notAttempted");
        localStorage.setItem("isNewUser", "true");
        localStorage.setItem("hasSeenTour", "true");
        localStorage.setItem("generatedAt", currentDate); // ✅ Set generatedAt

        console.log("Logged in user role (new user):", defaultRole);
        setLoadingMessage("Setting up your account...");
        navigate("/name");
      }

    } catch (err) {
      console.error("Google login error:", err);
      // Fallback for first-time users - set generatedAt to current date
      const email = JSON.parse(localStorage.getItem("googleUser"))?.email;
      if (email) {
        const currentDate = new Date().toISOString();
        const userData = {
          email,
          role: "Fundraiser_External",
          isNewUser: true
        };
        
        setSession(userData);
        
        localStorage.setItem("email", email);
        localStorage.setItem("quizStatus", "notAttempted");
        localStorage.setItem("isNewUser", "true");
        localStorage.setItem("hasSeenTour", "true");
        localStorage.setItem("generatedAt", currentDate); // ✅ Set generatedAt
        setLoadingMessage("Setting up your account...");
        navigate("/name");
      }
    } finally {
      loginInProgress.current = false;
      // Don't set loading to false here as we're navigating away
    }
  }, [parseJwt, setSession, navigate, redirectUserBasedOnRole]);

  useEffect(() => {
    // Reset Google initialization when logging out
    if (!isLoggedIn) {
      googleInitialized.current = false;
      
      // Clear any existing Google button
      const googleDiv = document.getElementById("googleSignInDiv");
      if (googleDiv) googleDiv.innerHTML = '';
    }

    // Don't initialize Google if user is already logged in
    if (isLoggedIn) return;

    // Load Google API script
    const loadGoogleScript = () => {
      if (window.google && window.google.accounts) {
        initializeGoogle();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log('Google API loaded');
        initializeGoogle();
      };
      script.onerror = () => {
        console.error('Failed to load Google API');
      };
      document.head.appendChild(script);
    };

    const initializeGoogle = () => {
      if (googleInitialized.current) return;
      
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
            scope: "email profile",
            context: "signin",
          });

          window.google.accounts.id.renderButton(
            document.getElementById("googleSignInDiv"),
            { 
              theme: "outline", 
              size: "large", 
              width: 300,
              click_listener: () => {
                console.log('Google button clicked');
                setLoading(true);
                setLoadingMessage("Connecting to Google...");
              }
            }
          );
          
          googleInitialized.current = true;
          console.log("ORIGIN:", window.location.origin);
          console.log("CLIENT:", import.meta.env.VITE_GOOGLE_CLIENT_ID);
          console.log('Google Sign-In initialized');
        } catch (error) {
          console.error('Error initializing Google Sign-In:', error);
        }
      } else {
        console.log("Google API not available yet");
        setTimeout(initializeGoogle, 500);
      }
    };

    loadGoogleScript();

    return () => {
      // Cleanup - but don't clear the button if we're just logging out
      if (isLoggedIn) {
        const googleDiv = document.getElementById("googleSignInDiv");
        if (googleDiv) googleDiv.innerHTML = '';
      }
    };
  }, [isLoggedIn, handleCredentialResponse, forceRender]); // Added forceRender dependency

  // If user is already logged in, show a message
  if (isLoggedIn) {
    return (
      <div className="h-screen bg-[#F4F9F8] flex justify-center items-center relative">
        <img
          src="/llogo.png"
          alt="Unessa Foundation Logo"
          className="w-32 h-auto absolute top-6 left-1/2 transform -translate-x-1/2 opacity-95"
        />
        <div className="bg-transparent px-6 py-10 text-center space-y-6">
          <h1 className="text-4xl font-bold text-[#333333]">
            Welcome back to Unessa Foundation
          </h1>
          <p className="text-lg text-gray-600">
            {redirecting ? "Redirecting to dashboard..." : "You are already logged in."}
          </p>
          <button 
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#F4F9F8] flex justify-center items-center relative">
      <img
        src="/llogo.png"
        alt="Unessa Foundation Logo"
        className="w-32 h-auto absolute top-6 left-1/2 transform -translate-x-1/2 opacity-95"
      />
      
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col justify-center items-center z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#10B981]"></div>
          <p className="mt-4 text-lg text-gray-700">{loadingMessage}</p>
        </div>
      )}
      
      <div className="bg-transparent px-6 py-10 text-center space-y-6 scale-[1.2]">
        <h1 className="text-4xl font-bold text-[#333333]">
          Welcome to Unessa Foundation
        </h1>
        <div id="googleSignInDiv" className="flex justify-center pt-5"></div>
      </div>
    </div>
  );
};

export default Login;