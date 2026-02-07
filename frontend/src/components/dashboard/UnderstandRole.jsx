import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
// Animation variants
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
const UnderstandRole = () => {
    const navigate = useNavigate();
  return (
    <div className="bg-gradient-to-b from-blue-50 to-cyan-50 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
      {/* Main Heading Section */}
      <motion.div
        className="mb-8 sm:mb-10 md:mb-12 lg:mb-14 xl:mb-16 p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14 rounded-3xl bg-white/90 backdrop-blur-md border-l-4 border-[#ECA90E] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
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
          <svg className="w-8 h-8 text-[#ECA90E]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
        </motion.div>
        <h1 className="text-[#ECA90E] text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-6">
          You're not just a volunteer—you're a Fundraising Catalyst.
        </h1>
        <p className="text-gray-800 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
          Your mission is simple but huge: use your network to power our cause. We trust you to be our voice, our energy, and our connection to a community of supporters. You're the one bringing the Vibe and building the Momentum to make real impact happen.
        </p>
      </motion.div>
      {/* Responsibilities Section */}
      <motion.div
        className="mb-8 sm:mb-10 md:mb-12 lg:mb-14 xl:mb-16 p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14 rounded-3xl bg-white/90 backdrop-blur-md border-r-4 border-[#ECA90E] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
        variants={itemVariants}
        initial="hidden"
        animate="show"
        whileHover={{ y: -5 }}
      >
        <h2 className="text-[#ECA90E] text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-6">
          Know your responsibilities in this internship
        </h2>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Responsibility 1 */}
          <motion.div
            className="p-5 sm:p-6 md:p-7 lg:p-8 bg-[#ECA90E]/10 rounded-2xl hover:bg-[#ECA90E]/20 transition-all duration-300 hover:shadow-xl border border-[#ECA90E]/30"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center mb-3">
              <svg className="w-6 h-6 mr-3 text-[#ECA90E]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
              </svg>
              <h3 className="text-[#ECA90E] text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold">Hit up your network</h3>
            </div>
            <p className="text-gray-700 text-sm sm:text-base md:text-lg lg:text-xl">Talk to your friends, family, and college crew. They trust you, so they'll listen.</p>
          </motion.div>
          {/* Responsibility 2 */}
          <motion.div
            className="p-5 sm:p-6 md:p-7 lg:p-8 bg-[#ECA90E]/10 rounded-2xl hover:bg-[#ECA90E]/20 transition-all duration-300 hover:shadow-xl border border-[#ECA90E]/30"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center mb-3">
              <svg className="w-6 h-6 mr-3 text-[#ECA90E]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-8H7v4h6V5zm2 8h1v2h-1v-2zm-8 0v2H5v-2h2zm-2-2H5v-2h2v2z" clipRule="evenodd" />
              </svg>
              <h3 className="text-[#ECA90E] text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold">Own your socials</h3>
            </div>
            <p className="text-gray-700 text-sm sm:text-base md:text-lg lg:text-xl">Post on Instagram, share on LinkedIn. Tell your story and our story—make it real.</p>
          </motion.div>
          {/* Responsibility 3 */}
          <motion.div
            className="p-5 sm:p-6 md:p-7 lg:p-8 bg-[#ECA90E]/10 rounded-2xl hover:bg-[#ECA90E]/20 transition-all duration-300 hover:shadow-xl border border-[#ECA90E]/30"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center mb-3">
              <svg className="w-6 h-6 mr-3 text-[#ECA90E]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <h3 className="text-[#ECA90E] text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold">Keep it real</h3>
            </div>
            <p className="text-gray-700 text-sm sm:text-base md:text-lg lg:text-xl">Be authentic and transparent. People are donating because of you, so let's keep it 100.</p>
          </motion.div>
          {/* Responsibility 4 */}
          <motion.div
            className="p-5 sm:p-6 md:p-7 lg:p-8 bg-[#ECA90E]/10 rounded-2xl hover:bg-[#ECA90E]/20 transition-all duration-300 hover:shadow-xl border border-[#ECA90E]/30"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center mb-3">
              <svg className="w-6 h-6 mr-3 text-[#ECA90E]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <h3 className="text-[#ECA90E] text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold">Stay in the loop</h3>
            </div>
            <p className="text-gray-700 text-sm sm:text-base md:text-lg lg:text-xl">We're here to back you up. Keep us posted on your wins so we can celebrate them and help you crush your goals.</p>
          </motion.div>
        </motion.div>
      </motion.div>
      {/* Impact Section */}
      <motion.div
        className="p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14 rounded-3xl bg-white/90 backdrop-blur-md border-l-4 border-[#ECA90E] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
        variants={itemVariants}
  initial="hidden"
  animate="show"
  whileHover={{ y: -5 }}
>
        <div className="flex items-start">
          <motion.div
            className="mr-4"
            animate={{
              scale: [1, 1.1, 1],
              transition: {
                repeat: Infinity,
                repeatType: "reverse",
                duration: 2
              }
            }}
          >
            <svg className="w-8 h-8 text-[#ECA90E]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </motion.div>
          <div>
            <h2 className="text-[#ECA90E] text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4">
              Your Impact Matters
            </h2>
            <p className="text-gray-800 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
              Every connection you make and every conversation you start creates ripples of change. You're not just raising funds—you're building a movement.
            </p>
            <motion.button
      className="mt-4 px-6 py-2 bg-[#ECA90E] text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
      whileHover={{
        scale: 1.05,
        boxShadow: "0 10px 15px -3px rgba(236, 169, 14, 0.3)",
      }}
      onClick={() => navigate("/community")}
    >
      Join The Movement 
    </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
export default UnderstandRole
