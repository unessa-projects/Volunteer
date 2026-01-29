// QuizOverlay.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";

const quizData = [
  { question: "What is the duration of the Fundraising Volunteer role?", options: ["15 Days", "30 Days", "45 Days", "60 Days"], answer: 1 },
  { question: "Where will you be working from?", options: ["Assigned center", "College campus", "Remote – anytime, anywhere", "Specific city assigned by the foundation"], answer: 2 },
  { question: "💡 What is your main mission as a volunteer?", options: ["Attend daily team meetings", "Design fundraising posters", "Leverage your personal network to raise funds", "Conduct research on child education"], answer: 2 },
  { question: "🏆 What is the name of the highest fundraising tier?", options: ["LEGEND", "HERO", "ICON", "IMPACTOR"], answer: 2 },
  { question: "📈 How much will you earn as a stipend?", options: ["Flat ₹1,000 regardless of funds", "30% of funds raised", "20% of funds raised", "No stipend"], answer: 2 },
];

const correctEmojis = ["🎉", "🥳", "🌟", "✨", "💯"];

// Normalizer: ensures consistent fields
const normalizeUser = (user) => {
  if (!user) return null;
  return {
    id: user.id || user._id || user.sub || null,
    name: user.name || user.fullName || null,
    email: user.email || null,
    token: user.token || user.accessToken || null,
    avatar: user.avatar || null,
    username: user.username || null,
    role: user.role || "Fundraiser_External",
  };
};

const QuizOverlay = ({ user, onComplete }) => {
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [quizResult, setQuizResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [correctAnswerEmoji, setCorrectAnswerEmoji] = useState(null);

  // Normalize user once
  const safeUser = normalizeUser(user);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  const handleOptionClick = (index) => {
    if (showAnswer) return;
    setSelectedOption(index);
    setShowAnswer(true);

    if (index === quizData[currentQuestion].answer) {
      setScore(prev => prev + 1);
      setCorrectAnswerEmoji(correctEmojis[currentQuestion]);
      setTimeout(() => setCorrectAnswerEmoji(null), 1000);
    } else {
      setCorrectAnswerEmoji("❌");
      setTimeout(() => setCorrectAnswerEmoji(null), 1000);
    }
  };

  const handleNext = async () => {
    const finalScore = score;

    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(q => q + 1);
      setSelectedOption(null);
      setShowAnswer(false);
    } else {
      if (finalScore >= 4) {
        // Check for user email
        if (!safeUser || !safeUser.email) {
          console.error("Cannot submit quiz: user email is missing from state.", safeUser);
          setError("Your user information seems to be missing. Please try logging out and logging back in to resolve this.");
          setQuizResult("❌ An unexpected error occurred.");
          return;
        }
        
        if (loading) return;
        setLoading(true);
        setQuizResult("⏳ Please wait, your offer letter is being generated...");

        try {
          // Fetch full user data from backend
          const { data: fullUser } = await axios.get(
            `http://localhost:5000/api/users/get-user/${safeUser.email}`
          );

          console.log("Full user fetched from DB:", fullUser);

          // Validate necessary fields
          if (!fullUser?.id || !fullUser?.name || !safeUser?.email) {
            throw new Error("User information is incomplete");
          }

          // Generate offer letter
          const response = await axios.post(
            "http://localhost:5000/offer/generate-offer",
            {
              userId: fullUser.id,
              name: fullUser.name,
              email: safeUser.email,
            },
            {
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${safeUser.token || ""}`,
              },
              withCredentials: true
            }
          );

          if (response.data.success) {
            await axios.post("http://localhost:5000/api/users/quiz-status", {
              email: safeUser.email,
              status: "passed",
            });

            // Update localStorage with full user info
            const updatedUser = { ...safeUser, id: fullUser.id, quizPassed: true };
            localStorage.setItem("googleUser", JSON.stringify(updatedUser));
            localStorage.setItem("quizStatus", "passed");

            setQuizResult("🎉 Please download your offer letter from the certificates 🎉");
            setShowConfetti(true);
            
            setTimeout(() => {
              setShowConfetti(false);
              navigate("/certificates");
              onComplete("passed");
            }, 3000);
          } else {
            throw new Error(response.data.message || "Failed to generate offer");
          }

        } catch (err) {
          console.error("Error generating offer letter:", err);
          setError(err.response?.data?.message || err.message || "Failed to generate offer letter");
          setLoading(false);
          setQuizResult(`❌ ${err.message} ❌`);
        }
      } else {
        // User failed the quiz
        try {
          await axios.post("http://localhost:5000/api/users/quiz-status", {
            email: safeUser?.email,
            status: "failed",
          });
        } catch (err) {
          console.error("Failed to update quiz status:", err);
        }

        localStorage.setItem("quizStatus", "failed");
        setQuizResult("😥 Sorry, you failed. Please try again later. 😥");
        setTimeout(() => onComplete("failed"), 3000);
      }
    }
  };

  const question = quizData[currentQuestion];

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/30 flex items-center justify-center">
      {showConfetti && <Confetti />}
      <div className="bg-white text-black rounded-2xl shadow-lg w-full max-w-2xl p-8 relative">
        <button
          onClick={() => onComplete("failed")}
          disabled={loading}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl font-bold"
        >
          ×
        </button>

        {quizResult ? (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4 text-black">Quiz Completed</h2>
            <p className="text-lg mb-6 text-gray-700">{quizResult}</p>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p className="text-sm">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-xs"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        ) : showIntro ? (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4 text-black">You Have a Small Task!</h2>
            <p className="text-lg mb-6 text-gray-700">
              Answer a few questions correctly to receive your{" "}
              <span className="font-bold text-blue-600">Offer Letter</span>.
            </p>
            <button
              onClick={() => setShowIntro(false)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Start Quiz
            </button>
          </div>
        ) : (
          <>
            {correctAnswerEmoji && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                <div className="text-8xl animate-pop">{correctAnswerEmoji}</div>
              </div>
            )}
            <h2 className="text-2xl font-semibold mb-6 text-black">Quiz Time</h2>
            <p className="text-lg font-medium mb-4 text-black">
              Question {currentQuestion + 1}: {question.question}
            </p>
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(index)}
                  disabled={showAnswer}
                  className={`w-full text-left px-4 py-2 rounded-lg border transition ${
                    selectedOption === index
                      ? index === question.answer
                        ? "bg-green-100 border-green-500 text-green-800"
                        : "bg-red-100 border-red-500 text-red-800"
                      : "hover:bg-gray-100 border-gray-300 text-black"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            {showAnswer && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleNext}
                  disabled={loading}
                  className={`px-6 py-2 rounded-lg text-white ${
                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {loading ? "Generating..." : currentQuestion < quizData.length - 1 ? "Next" : "Finish"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QuizOverlay;