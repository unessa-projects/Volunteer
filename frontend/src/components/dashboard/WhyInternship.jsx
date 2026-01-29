import React from 'react';
import { motion } from 'framer-motion';
// Animation variants
import { useNavigate } from "react-router-dom";
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};
const spinVariants = {
  hidden: { opacity: 0, rotate: -180 },
  show: {
    opacity: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};
const WhyInternship = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-gradient-to-b from-blue-50 to-cyan-50 p-4 sm:p-6 md:p-8">
      {/* Hero Section */}
      <motion.div
        className="mb-8 sm:mb-10 md:mb-12 p-6 sm:p-8 md:p-10 rounded-3xl bg-white/90 backdrop-blur-md border-l-4 border-[#ECA90E] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
        variants={itemVariants}
  initial="hidden"
  animate="show"
  whileHover={{ y: -5 }}
>
        <motion.div
          className="flex items-center mb-4"
          variants={spinVariants}
  initial="hidden"
  animate="show"
>
          <svg className="w-6 h-6 text-[#ECA90E]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
          </svg>
        </motion.div>
        <h1 className="text-[#ECA90E] text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
          Honestly? Forget the boring internships.
        </h1>
        <p className="text-gray-800 text-base sm:text-lg md:text-xl">
          This is a chance to be the main character in a mission that actually matters. You get to flex your influence for good, building a community and making a real-world impact—all on your own time, from anywhere. It's remote, it's flexible, and it's a vibe.
        </p>
      </motion.div>
      {/* Future Impact Section */}
      <motion.div
        className="mb-8 sm:mb-10 md:mb-12 p-6 sm:p-8 md:p-10 rounded-3xl bg-white/90 backdrop-blur-md border-r-4 border-[#ECA90E] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
        variants={itemVariants}
        initial="hidden"
        animate="show"
        whileHover={{ y: -5 }}
      >
        <h2 className="text-[#ECA90E] text-xl sm:text-2xl md:text-3xl font-bold mb-4">
          How this experience will shape your future
        </h2>
        <p className="text-gray-800 text-base sm:text-lg md:text-xl mb-6">
          This is how you level up your resume for real. This experience isn't just a bullet point—it's a launchpad.
        </p>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Skill 1 */}
          <motion.div
            className="p-5 sm:p-6 bg-[#ECA90E]/10 rounded-2xl hover:bg-[#ECA90E]/20 transition-all duration-300 hover:shadow-xl border border-[#ECA90E]/30"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 mr-2 text-[#ECA90E]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
              </svg>
              <h3 className="text-[#ECA90E] text-lg sm:text-xl font-semibold">Networking</h3>
            </div>
            <p className="text-gray-700 text-sm sm:text-base">Master the art of the persuasive DM and build a network that's actually valuable.</p>
          </motion.div>
          {/* Skill 2 */}
          <motion.div
            className="p-5 sm:p-6 bg-[#ECA90E]/10 rounded-2xl hover:bg-[#ECA90E]/20 transition-all duration-300 hover:shadow-xl border border-[#ECA90E]/30"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 mr-2 text-[#ECA90E]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2H5a1 1 0 010-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
              </svg>
              <h3 className="text-[#ECA90E] text-lg sm:text-xl font-semibold">Digital Strategy</h3>
            </div>
            <p className="text-gray-700 text-sm sm:text-base">Learn how to go viral for a good cause and build a killer online presence.</p>
          </motion.div>
          {/* Skill 3 */}
          <motion.div
            className="p-5 sm:p-6 bg-[#ECA90E]/10 rounded-2xl hover:bg-[#ECA90E]/20 transition-all duration-300 hover:shadow-xl border border-[#ECA90E]/30"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 mr-2 text-[#ECA90E]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clipRule="evenodd" />
              </svg>
              <h3 className="text-[#ECA90E] text-lg sm:text-xl font-semibold">Leadership</h3>
            </div>
            <p className="text-gray-700 text-sm sm:text-base">Develop the confidence to drive change and lead the way.</p>
          </motion.div>
        </motion.div>
      </motion.div>
      {/* Resume Section */}
      <motion.div
        className="p-6 sm:p-8 md:p-10 rounded-3xl bg-white/90 backdrop-blur-md border-l-4 border-[#ECA90E] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
        variants={itemVariants}
        initial="hidden"
        animate="show"
        whileHover={{ y: -5 }}
      >
        <div className="flex items-start">
          <motion.div
            className="mr-4"
            animate={{
              rotate: [0, 10, -10, 0],
              transition: {
                repeat: Infinity,
                repeatType: "reverse",
                duration: 2
              }
            }}
          >
            <svg className="w-8 h-8 text-[#ECA90E]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
          </motion.div>
          <div>
            <h2 className="text-[#ECA90E] text-xl sm:text-2xl md:text-3xl font-bold mb-3">
              Your resume will be full of wins, not just words.
            </h2>
            <p className="text-gray-800 text-base sm:text-lg md:text-xl">
              This is your chance to stand out from the crowd and show everyone you're ready to do big things.
            </p>
            <motion.button
      className="mt-4 px-6 py-2 bg-[#ECA90E] text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
      whileHover={{
        scale: 1.05,
        boxShadow: "0 10px 15px -3px rgba(236, 169, 14, 0.3)",
      }}
      onClick={() => navigate("/community")}
    >
      Go to Learning
    </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
export default WhyInternship;
