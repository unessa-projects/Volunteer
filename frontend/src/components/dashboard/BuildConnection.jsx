import React from 'react';

const sections = [
  {
    title: 'START WITH GENUINE CONVERSATIONS',
    strategy: "Initiate conversations that aren't just about fundraising. Show interest in the person's life or goals to build authentic rapport.",
    why: "People are more willing to support someone they trust and connect with on a personal level.",
    tip: "Begin with friendly messages and naturally transition into your cause."
  },
  {
    title: 'BUILD TRUST THROUGH CONSISTENCY',
    strategy: "Be consistent in your communication and updates about the cause. Keep them informed about progress and milestones.",
    why: "Consistent messaging builds trust and shows your commitment.",
    tip: "Even small updates can keep connections warm and engaged."
  },
  {
    title: 'UTILIZE SHARED INTERESTS',
    strategy: "Highlight how your cause aligns with shared interests or values. Connect over mutual passions.",
    why: "Common ground makes people more receptive and emotionally invested.",
    tip: "Mention hobbies, communities, or values you both share."
  },
  {
    title: 'APPRECIATE AND ACKNOWLEDGE',
    strategy: "Always thank people for their time, interest, or support, regardless of whether they contribute.",
    why: "Gratitude builds long-term goodwill and makes people feel valued.",
    tip: "Even a simple thank-you message can leave a lasting impact."
  }
];

const BuildConnection = () => {
  return (
    <div className="px-4 py-10 max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-indigo-700 text-center mb-2">
        CROWDFUNDING
      </h1>
      <h2 className="text-xl md:text-2xl text-gray-700 text-center mb-6 font-semibold">
        HACKS FOR YOU
      </h2>
      <h3 className="text-lg font-medium text-center text-gray-600 mb-6">
        BUILDING CONNECTIONS THAT LAST
      </h3>
      <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
        Building authentic connections is the foundation of effective fundraising. 
        Strong relationships lead to better engagement, trust, and long-term support. 
        Here are key strategies to help you build meaningful relationships with potential supporters.
      </p>

      {sections.map((sec, index) => (
        <div
          key={index}
          className="bg-white shadow-md rounded-xl border border-gray-200 p-6 mb-6"
        >
          <h4 className="text-lg md:text-xl font-semibold text-indigo-600 mb-3">{sec.title}</h4>
          <div className="space-y-2 text-gray-700 text-sm md:text-base">
            <p><span className="font-semibold">Strategy:</span> {sec.strategy}</p>
            <p><span className="font-semibold">Why:</span> {sec.why}</p>
            <p><span className="font-semibold">Tip:</span> {sec.tip}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BuildConnection;
