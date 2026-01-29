import React from "react";
import { motion } from "framer-motion";
const rewards = [
  {
    title: "VIBE",
    amount: "₹1,000 - ₹5,000",
    perks: [
      "20% Stipend",
      "Certificate of completion"
    ],
    
    borderColor: "border-[#ECA90E]"
  },
  {
    title: "MOMENTUM",
    amount: "₹5,000 - ₹15,000",
    perks: [
      "20% Stipend",
      "Certificate of completion",
      "LinkedIn recommendation from our President",
      "Certificate for Crowdfunding course"
    ],
    
    borderColor: "border-[#ECA90E]"
  },
  {
    title: "CATALYST",
    amount: "₹15,000 - ₹30,000",
    perks: [
      "20% Stipend",
      "Certificate of completion",
      "LinkedIn recommendation from our President",
      "Certificate for Crowdfunding course",
      "Social Media Shoutout",
      "Internship Opportunity (As per intern's qualifications and vacancy)"
    ],
    
    borderColor: "border-[#ECA90E]"
  },
  {
    title: "ICON",
    amount: "₹30,000+",
    perks: [
      "20% Stipend",
      "Certificate of completion",
      "LinkedIn recommendation from our President",
      "Certificate for Crowdfunding course",
      "Social Media Shoutout",
      "Internship Opportunity (As per intern's qualifications and vacancy)",
      "Letter of Recommendation from President of Unessa"
    ],
    borderColor: "border-[#ECA90E]"
  },
];
const Rewards = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        when: "beforeChildren"
      }
    }
  };
  const cardVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      y: -10,
      scale: 1.03,
      boxShadow: "0 20px 25px -5px rgba(236, 169, 14, 0.2)"
    }
  };
  const iconVariants = {
    hover: {
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 0.5
      }
    }
  };
  return (
    <div className="px-4 py-12 sm:py-16 bg-gradient-to-b from-blue-50 to-cyan-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="text-center mb-12 sm:mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-[#ECA90E] mb-3">
          REWARDS
        </h1>
        <p className="text-gray-800 max-w-2xl text-xl sm:text-2xl mx-auto">
          Earn exciting rewards based on your fundraising achievements
        </p>
      </motion.div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4 sm:px-6"
      >
        {rewards.map((reward, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover="hover"
            className={`rounded-2xl p-6 sm:p-8 bg-white/90 backdrop-blur-md border-t-4 ${reward.borderColor} shadow-lg hover:shadow-xl transition-all duration-300`}
          >
            <div className="flex flex-col h-full">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#ECA90E]">
                    {reward.title}
                  </h2>
                  <p className="text-gray-800 text-xl sm:text-2xl font-medium mt-2">
                    {reward.amount}
                  </p>
                </div>
                <motion.span
                  className="text-3xl sm:text-4xl"
                  variants={iconVariants}
                >
                  {reward.icon}
                </motion.span>
              </div>
              <div className="flex-grow">
                <ul className="space-y-3 sm:space-y-4">
                  {reward.perks.map((perk, i) => (
                    <motion.li
                      key={i}
                      className="flex items-start"
                      whileHover={{ x: 5 }}
                    >
                      <svg
                        className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0 text-[#ECA90E]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700 text-sm sm:text-base">{perk}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
export default Rewards;
