import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const lessons = [
  {
    title: "Follow-Up to Yes",
    content: {
      intro: "Mastering follow-ups is essential for turning interest into action. The way you follow up can define your relationship with a potential donor.",
      points: [
        { icon: "🔄", title: "Be Persistently Thoughtful", desc: "Use well-timed follow-ups that show you care, not just that you're waiting." },
        { icon: "💬", title: "Build Trust, Not Pressure", desc: "Add value in each message, whether it's new information, gratitude, or updates." },
        { icon: "📅", title: "Timing is Everything", desc: "Follow up within a clear and respectful timeframe to stay top of mind." },
        { icon: "📝", title: "Personalize Every Touch", desc: "Avoid templates. Reference past conversations and show you've been listening." }
      ],
      conclusion: "Follow-ups aren't reminders—they're relationship builders. Make every follow-up count with care and relevance."
    }
  },
  {
    title: "Power Fundraising: Unlocking Major Donations",
    content: {
      intro: "Major donations don’t come from luck—they come from clarity, strategy, and boldness.",
      points: [
        { icon: "🔍", title: "Do Your Homework", desc: "Know your potential donor's interests, values, and giving patterns." },
        { icon: "🎯", title: "Tailor Your Ask", desc: "Align your proposal with the donor’s motivations and capacity." },
        { icon: "🗣️", title: "Practice the Pitch", desc: "Be confident, concise, and focused when presenting your big ask." },
        { icon: "🤝", title: "Create a Partnership", desc: "Position large gifts as shared missions, not transactions." }
      ],
      conclusion: "Unlocking major donations is about building aligned visions and making bold, respectful asks."
    }
  },
  {
    title: "How to Build Meaningful Relationships",
    content: {
      intro: "Fundraising is rooted in relationships—authentic, reciprocal, and enduring.",
      points: [
        { icon: "🧠", title: "Know Their Story", desc: "Understand what drives your supporters personally and professionally." },
        { icon: "👂", title: "Listen More Than You Talk", desc: "Ask thoughtful questions and engage deeply with their responses." },
        { icon: "📈", title: "Track the Journey", desc: "Record interactions and preferences to build informed connections." },
        { icon: "🌱", title: "Be There Beyond the Ask", desc: "Support and acknowledge them outside of fundraising moments." }
      ],
      conclusion: "Relationships take time—invest consistently to build lasting impact."
    }
  },
  {
    title: "From One to Many: The Art of Expanding Your Network",
    content: {
      intro: "Great fundraisers multiply their impact by activating networks.",
      points: [
        { icon: "🌐", title: "Map the Network", desc: "Understand who your supporters know and how they connect." },
        { icon: "📣", title: "Empower Advocates", desc: "Give your champions the tools to share your mission." },
        { icon: "🎁", title: "Offer Value in Return", desc: "Make involvement rewarding for your network extensions." },
        { icon: "👥", title: "Make the First Connection Easy", desc: "Lower the barrier for referrals or introductions." }
      ],
      conclusion: "Your network can grow exponentially when you equip others to share your cause."
    }
  },
  {
    title: "Stand Out, Speak Up",
    content: {
      intro: "Don’t get lost in the noise—your story and mission deserve attention.",
      points: [
        { icon: "🎤", title: "Clarify Your Message", desc: "Keep your mission crisp, emotional, and inspiring." },
        { icon: "🧭", title: "Speak With Purpose", desc: "Tie every message back to your core values and impact." },
        { icon: "📱", title: "Use Multiple Channels", desc: "Be visible where your audience is—email, social, events, etc." },
        { icon: "📸", title: "Show, Don’t Just Tell", desc: "Use visuals and stories to make your message unforgettable." }
      ],
      conclusion: "Your voice matters. Use it boldly and clearly to attract aligned supporters."
    }
  },
  {
    title: "Rise, Reset, Repeat: Staying Energized in a Tough Crowd",
    content: {
      intro: "Rejections are part of the journey. Staying energized is your secret weapon.",
      points: [
        { icon: "🧘", title: "Build Emotional Stamina", desc: "Process rejections without taking them personally." },
        { icon: "🔁", title: "Reflect & Reset", desc: "Learn from each no, then get ready for the next yes." },
        { icon: "🧗", title: "Celebrate Micro-Wins", desc: "Track and honor progress, not just big outcomes." },
        { icon: "⚡", title: "Fuel Your Passion", desc: "Reconnect regularly with your mission to stay motivated." }
      ],
      conclusion: "Persistence is powered by purpose. Refuel, refocus, and rise again."
    }
  },
  {
    title: "CREATING URGENCY WITHOUT PRESSURE",
    content: {
      intro: "Urgency inspires action, but pressure drives people away.",
      points: [
        { icon: "⏳", title: "Highlight Timeliness", desc: "Use deadlines or timely impact opportunities to encourage giving." },
        { icon: "📊", title: "Show the Stakes", desc: "Explain what happens with or without immediate support." },
        { icon: "🌟", title: "Frame the Opportunity", desc: "Present giving as a chance to be part of something special." },
        { icon: "💡", title: "Stay Solution-Oriented", desc: "Keep the focus on what the donor helps make possible." }
      ],
      conclusion: "Urgency works when it feels exciting—not manipulative."
    }
  },
  {
    title: "TURNING SOCIAL MEDIA INTO A FUNDRAISING ENGINE",
    content: {
      intro: "Social media isn’t just for awareness—it’s a tool for action.",
      points: [
        { icon: "📢", title: "Be Consistent", desc: "Post regularly to build presence and trust." },
        { icon: "🎬", title: "Use Storytelling Formats", desc: "Videos, reels, and carousels capture attention and emotion." },
        { icon: "🛒", title: "Make Giving Easy", desc: "Include clear calls-to-action and donation links." },
        { icon: "🔄", title: "Repurpose Content", desc: "Adapt one story across formats to stay visible without burnout." }
      ],
      conclusion: "When used intentionally, social platforms can become donation pipelines."
    }
  },
  {
    title: "BUILDING TRUST WITH FIRST-TIME DONORS",
    content: {
      intro: "First impressions last—your new donors are testing the waters.",
      points: [
        { icon: "📩", title: "Say Thanks Immediately", desc: "Automated or personal, timely gratitude builds credibility." },
        { icon: "🧾", title: "Show Where It Went", desc: "Report how their gift made an impact right away." },
        { icon: "📆", title: "Keep in Touch", desc: "Start a welcome series or personal outreach to build connection." },
        { icon: "🎉", title: "Celebrate Their First Step", desc: "Make them feel like they’ve joined something meaningful." }
      ],
      conclusion: "Trust starts from the first moment. Nail that first impression."
    }
  },
  {
    title: "ASKING WITHOUT FEAR",
    content: {
      intro: "The ask is where fear shows up—but it doesn’t have to.",
      points: [
        { icon: "🤔", title: "Know Your Why", desc: "Confidence grows when you're deeply connected to your mission." },
        { icon: "📚", title: "Prepare and Practice", desc: "Rehearse your ask like it matters—because it does." },
        { icon: "🧠", title: "Shift the Frame", desc: "You’re offering an opportunity—not begging." },
        { icon: "💪", title: "Embrace Rejection", desc: "A no is never personal—it's just part of the work." }
      ],
      conclusion: "Courageous asks come from clarity, practice, and belief in your cause."
    }
  },
  {
    title: "USING PEER INFLUENCE TO DRIVE CONTRIBUTIONS",
    content: {
      intro: "People give when people like them give. Use social proof wisely.",
      points: [
        { icon: "🧑‍🤝‍🧑", title: "Highlight Community", desc: "Show others who are already supporting your cause." },
        { icon: "📸", title: "Feature Real Donors", desc: "Use testimonials, quotes, and photos to build trust." },
        { icon: "📈", title: "Leverage Momentum", desc: "Share live updates of campaign progress and participation." },
        { icon: "🏅", title: "Celebrate Supporters Publicly", desc: "Recognition encourages others to follow their lead." }
      ],
      conclusion: "Social influence builds confidence—make giving feel like joining a movement."
    }
  },
  {
    title: "CELEBRATING EVERY WIN TO BUILD MOMENTUM",
    content: {
      intro: "Donor journeys thrive on milestones, not just finish lines.",
      points: [
        { icon: "🎊", title: "Celebrate Small Wins", desc: "Honor steps like the first gift, event signup, or referral." },
        { icon: "📅", title: "Mark Anniversaries", desc: "Thank supporters on join dates or campaign milestones." },
        { icon: "🌟", title: "Share Collective Progress", desc: "Remind your community what they’ve achieved together." },
        { icon: "📷", title: "Document the Journey", desc: "Capture and share moments along the way—not just outcomes." }
      ],
      conclusion: "Celebration creates energy. Energy drives momentum."
    }
  }
];


const Community = () => {
  const [currentLesson, setCurrentLesson] = useState(0);

  const nextLesson = () => {
    setCurrentLesson((prev) => (prev + 1) % lessons.length);
  };

  const prevLesson = () => {
    setCurrentLesson((prev) => (prev - 1 + lessons.length) % lessons.length);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#096d7d] text-white">
      {/* Desktop Sidebar */}
      <div className="hidden md:block bg-[#096d7d33] w-64 p-4 overflow-y-auto sticky top-0 h-screen">
        <h2 className="text-xl font-bold mb-4">Learning Modules</h2>
        <div className="space-y-2">
          {lessons.map((lesson, index) => (
            <button
              key={index}
              onClick={() => setCurrentLesson(index)}
              className={`w-full text-left p-3 rounded-lg transition-all ${
                currentLesson === index
                  ? 'bg-[#ECA90E] text-[#043238] font-bold'
                  : 'text-white hover:bg-[#0a7f91] hover:bg-opacity-30'
              }`}
            >
              {lesson.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Navigation Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-[#043238] sticky top-0 z-10">
          <button 
            onClick={prevLesson}
            className="p-2 rounded-full hover:bg-[#096d7d] transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-lg font-bold text-center px-2">
            {lessons[currentLesson].title}
          </h2>
          <button 
            onClick={nextLesson}
            className="p-2 rounded-full hover:bg-[#096d7d] transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Lesson Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <h2 className="text-2xl font-bold mb-6 hidden md:block">
            {lessons[currentLesson].title}
          </h2>
          
          <div className="bg-[#06444f] bg-opacity-50 rounded-xl p-6 mb-6">
            <p className="mb-6 text-sm md:text-base">{lessons[currentLesson].content.intro}</p>
            
            {/* Mobile Table View */}
            <div className="md:hidden">
              <div className="grid grid-cols-1 gap-4">
                {lessons[currentLesson].content.points.map((point, i) => (
                  <div key={i} className="bg-[#096d7d] rounded-lg p-4">
                    <div className="flex items-start">
                      <span className="text-2xl mr-3">{point.icon}</span>
                      <div>
                        <h3 className="font-bold text-[#ECA90E]">{point.title}</h3>
                        <p className="text-sm mt-1">{point.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop List View */}
            <ul className="hidden md:block space-y-4 mb-8">
              {lessons[currentLesson].content.points.map((point, i) => (
                <li key={i} className="flex items-start">
                  <span className="mr-3 text-xl">{point.icon}</span>
                  <div>
                    <span className="font-semibold">{point.title}</span> — {point.desc}
                  </div>
                </li>
              ))}
            </ul>

            <div className="bg-[#096d7d] p-4 mt-4 rounded-lg">
              <p className="font-semibold mb-2">💬 FINAL THOUGHTS</p>
              <p className="text-sm md:text-base">{lessons[currentLesson].content.conclusion}</p>
            </div>
          </div>

          {/* Mobile Navigation Footer */}
          <div className="md:hidden flex justify-between gap-4 mt-6">
            <button 
              onClick={prevLesson}
              className="flex-1 flex items-center justify-center bg-[#ECA90E] text-[#043238] px-4 py-3 rounded-lg font-bold"
            >
              <ChevronLeft size={18} className="mr-1" />
              Previous
            </button>
            <button 
              onClick={nextLesson}
              className="flex-1 flex items-center justify-center bg-[#ECA90E] text-[#043238] px-4 py-3 rounded-lg font-bold"
            >
              Next
              <ChevronRight size={18} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;