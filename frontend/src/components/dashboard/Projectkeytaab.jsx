import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiArrowRight } from 'react-icons/fi';

const ProjectSneh = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const images = [
    "/sneh1.webp",
    "/sneh2.webp",
    "/sneh3.webp"
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Animation variants
  const starSpin = {
    hidden: { rotate: -90, opacity: 0 },
    visible: { 
      rotate: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 200 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.6,
        type: "spring",
        stiffness: 100
      }
    })
  };

  const contentBlocks = [
    {
      id: 1,
      title: "Empowering Children Beyond Survival",
      content: "From shelter to self-sufficiency – through skills, support, and spirit.",
      type: "header",
      position: "center"
    },
    {
      id: 2,
      type: "image",
      position: "full"
    },
    {
      id: 3,
      title: "The Problem We're Solving",
      content: "In India, most children in orphanages receive basics but lack equal opportunities.",
      bullets: [
        "Lack quality learning and real-world exposure",
        "Often end up in low-paying jobs after 18"
      ],
      type: "content",
      position: "left",
      icon: <FiStar className="text-[#ECA90E] text-2xl" />
    },
    {
      id: 4,
      title: "Project Sneh",
      content: "Where Confidence, Character, and Skills Come Together",
      quote: "Because every child deserves not just care—but a chance to thrive.",
      type: "highlight",
      position: "right",
      icon: <FiStar className="text-[#ECA90E] text-2xl" />
    },
    {
      id: 5,
      title: "What is Project Sneh?",
      content: "A volunteer-led program providing essential skills:",
      skills: [
        "Education", "English", "Life Skills", 
        "Confidence", "Etiquette", "Career Prep"
      ],
      type: "content",
      position: "left",
      icon: <FiStar className="text-[#ECA90E] text-2xl" />
    },
    {
      id: 6,
      title: "Why It's Needed",
      content: "Most children in orphanages receive basic schooling but lack employable skills.",
      type: "content",
      position: "right",
      icon: <FiStar className="text-[#ECA90E] text-2xl" />
    },
    {
      id: 7,
      title: "What We Teach",
      content: "Helping Children Rise—Academically, Personally, and Professionally",
      type: "content",
      position: "left",
      icon: <FiStar className="text-[#ECA90E] text-2xl" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {contentBlocks.map((block, i) => (
          <motion.div
            key={block.id}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={cardVariants}
            className={`
              ${block.position === 'full' ? 'md:col-span-3' : ''}
              ${block.position === 'center' ? 'md:col-span-3' : ''}
              ${block.position === 'left' ? 'md:col-start-1 md:col-span-2' : ''}
              ${block.position === 'right' ? 'md:col-start-2 md:col-span-2' : ''}
              relative
            `}
          >
            {/* Header Block */}
            {block.type === "header" && (
              <div className="text-center space-y-4 p-6">
                <motion.h1 
                  className="text-4xl font-extrabold text-[#ECA90E]"
                  whileHover={{ scale: 1.02 }}
                >
                  {block.title}
                </motion.h1>
                <motion.p 
                  className="text-2xl font-bold text-gray-800"
                  whileHover={{ scale: 1.01 }}
                >
                  {block.content}
                </motion.p>
              </div>
            )}

            {/* Image Block */}
            {block.type === "image" && (
              <motion.div 
                className="relative h-80 md:h-96 rounded-3xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.01 }}
              >
                {images.map((img, index) => (
                  <motion.img
                    key={img}
                    src={img}
                    alt={`Project Sneh ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: index === currentImage ? 1 : 0,
                      transition: { duration: 0.8 }
                    }}
                  />
                ))}
              </motion.div>
            )}

            {/* Content Block */}
            {block.type === "content" && (
              <motion.div 
                className={`bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-lg h-full flex flex-col
                  ${block.position === 'left' ? 'border-l-4 border-[#ECA90E]' : ''}
                  ${block.position === 'right' ? 'border-r-4 border-[#ECA90E]' : ''}
                `}
                whileHover={{ y: -5 }}
              >
                <motion.div variants={starSpin} className="absolute -top-3 -left-3">
                  {block.icon}
                </motion.div>
                <h2 className="text-2xl font-extrabold text-[#ECA90E] mb-3">{block.title}</h2>
                <p className="text-xl font-bold text-gray-800 mb-4">{block.content}</p>
                
                {block.bullets && (
                  <ul className="space-y-2 mb-4">
                    {block.bullets.map((bullet, idx) => (
                      <motion.li 
                        key={idx}
                        className="flex items-start text-lg font-bold text-gray-700"
                        whileHover={{ x: 5 }}
                      >
                        <span className="text-[#ECA90E] mr-2">•</span>
                        {bullet}
                      </motion.li>
                    ))}
                  </ul>
                )}

                {block.skills && (
                  <div className="mt-auto grid grid-cols-2 gap-2">
                    {block.skills.map((skill, idx) => (
                      <motion.div
                        key={idx}
                        className="bg-[#ECA90E]/20 px-3 py-1 rounded-full text-center"
                        whileHover={{ 
                          scale: 1.05,
                          backgroundColor: "rgba(236, 169, 14, 0.3)"
                        }}
                      >
                        <span className="text-sm font-bold text-gray-800">{skill}</span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Highlight Block */}
            {block.type === "highlight" && (
              <motion.div 
                className="bg-[#ECA90E]/10 backdrop-blur-sm p-8 rounded-3xl shadow-lg border-2 border-[#ECA90E]/30 h-full"
                whileHover={{ scale: 1.01 }}
              >
                <motion.div variants={starSpin} className="absolute -top-3 -right-3">
                  {block.icon}
                </motion.div>
                <h2 className="text-2xl font-extrabold text-[#ECA90E] mb-2">{block.title}</h2>
                <p className="text-xl italic font-bold text-[#ECA90E] mb-3">{block.content}</p>
                <p className="text-lg font-bold text-gray-800">{block.quote}</p>
              </motion.div>
            )}
          </motion.div>
        ))}

        {/* CTA Block - Center aligned */}
        <motion.div
          custom={contentBlocks.length}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={cardVariants}
          className="md:col-span-3 text-center pt-8"
        >
          <motion.a 
            href="http://localhost:5000/intervention" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center bg-[#ECA90E] hover:bg-[#f8b824] text-white font-extrabold px-8 py-4 rounded-full shadow-lg text-xl transition-all duration-300 group"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 25px -5px rgba(236, 169, 14, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More About Project Sneh
            <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectSneh;
