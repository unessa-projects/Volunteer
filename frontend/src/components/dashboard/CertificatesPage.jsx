import React, { useState, useEffect } from "react";
import QuizOverlay from "./QuizOverlay";
import axios from "axios";
const CertificatesPage = () => {
  const [showQuiz, setShowQuiz] = useState(false);
  const user = JSON.parse(localStorage.getItem("googleUser") || "{}");
  const storageKey = `quizStatus_${user._id}`;
  const [quizStatus, setQuizStatus] = useState(
    localStorage.getItem(storageKey) || "notAttempted"
  );
  // new state for completion certificate
  const [loading, setLoading] = useState(false);
  const [completionSent, setCompletionSent] = useState(false);
  const [message, setMessage] = useState("");
  // internship progress states
  const [daysLeft, setDaysLeft] = useState(30);
  const [daysSinceGenerated, setDaysSinceGenerated] = useState(0);
  // fetch quiz status
  useEffect(() => {
    if (user?.email) {
      axios
        .get(`http://localhost:5000/api/users/quiz-status/${user.email}`)
        .then((res) => setQuizStatus(res.data.quizStatus))
        .catch(() => setQuizStatus("notAttempted"));
    }
  }, [user]);
  // fetch certificate status from backend
  useEffect(() => {
    if (user?.email) {
      axios
        .get(`http://localhost:5000/api/certificates/status/${user.email}`)
        .then((res) => setCompletionSent(res.data.certificateSent))
        .catch(() => setCompletionSent(false));
    }
  }, [user]);
  // calculate internship days
  useEffect(() => {
    const updateDays = () => {
      const generatedAt = localStorage.getItem("generatedAt");
      if (generatedAt) {
        const startDate = new Date(generatedAt);
        const today = new Date();
        const startDateOnly = new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate()
        );
        const todayOnly = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        );
        const diffTime = todayOnly - startDateOnly;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        setDaysSinceGenerated(diffDays);
        setDaysLeft(Math.max(0, 30 - diffDays));
      }
    };
    updateDays();
    const interval = setInterval(updateDays, 3600000);
    return () => clearInterval(interval);
  }, []);
  const handleQuizComplete = (result) => {
    setQuizStatus(result);
    localStorage.setItem(storageKey, result);
    setShowQuiz(false);
  };
  const getMailToLink = (email) => {
    const domain = email.split("@")[1];
    switch (domain) {
      case "gmail.com":
        return "https://mail.google.com";
      case "yahoo.com":
        return "https://mail.yahoo.com";
      case "outlook.com":
      case "hotmail.com":
        return "https://outlook.live.com";
      case "aol.com":
        return "https://mail.aol.com";
      default:
        return `https://mail.${domain}`;
    }
  };
  const sendCertificate = async () => {
    if (!user?.name || !user?.email) {
      setMessage(":x: Missing user details");
      return;
    }
    try {
      setLoading(true);
      setMessage("");
      const res = await axios.post(
        "http://localhost:5000/api/certificates/generate-certificate",
        {
          name: user.name,
          email: user.email,
        }
      );
      if (res.status === 200) {
        setCompletionSent(true); // persist state locally
        setMessage(":white_check_mark: Certificate sent to your email!");
      } else {
        setMessage(":x: Failed to send certificate");
      }
    } catch (err) {
      console.error(err);
      setMessage(":x: Error sending certificate");
    } finally {
      setLoading(false);
    }
  };
  const hasPassed = quizStatus === "passed";
  const hasFailed = quizStatus === "failed";
  const notAttempted = quizStatus === "notAttempted";
  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Your Certificates</h1>
      {/* Offer Letter Section (unchanged) */}
      <div className="bg-[#06444F] p-4 rounded-lg shadow-lg mb-4">
        <h2 className="text-xl font-semibold">Offer Letter</h2>
        {hasPassed ? (
          <div className="mt-2 text-gray-300">
            Your offer letter has been sent to your email address:
            <a
              href={getMailToLink(user.email)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-200 ml-1 break-all"
            >
              {user.email}
            </a>
            .
          </div>
        ) : (
          <div className="mt-2 text-gray-300">
            :lock: Locked — Complete the quiz to unlock.
          </div>
        )}
        {(notAttempted || hasFailed) && (
          <button
            onClick={() => setShowQuiz(true)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {hasFailed ? "Retry Quiz" : "Start Quiz"}
          </button>
        )}
      </div>
      {/* Completion Certificate Section (updated) */}
      <div className="bg-[#06444F] p-4 rounded-lg shadow-lg mb-4">
        <h2 className="text-xl font-semibold">Completion Certificate</h2>
        {completionSent ? (
          <div className="mt-2 text-gray-300">
            Your completion certificate has been sent to your email address:
            <a
              href={getMailToLink(user.email)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-200 ml-1"
            >
              {user.email}
            </a>
            .
          </div>
        ) : (
          <button
            onClick={sendCertificate}
            disabled={loading || daysLeft > 0}
            className={`mt-4 px-4 py-2 rounded text-white ${
              daysLeft > 0
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading
              ? "Sending..."
              : daysLeft > 0
              ? "Available after completion"
              : "Get Certificate"}
          </button>
        )}
        {message && <p className="mt-2 text-sm">{message}</p>}
      </div>
      
      {/* Quiz Overlay */}
      {showQuiz && <QuizOverlay user={user} onComplete={handleQuizComplete} />}
    </div>
  );
};
export default CertificatesPage;