import React from 'react';
import {
  Lightbulb,
  MessageSquareText,
  AlertTriangle,
  Smile
} from 'lucide-react';

const sections = [
  {
    title: 'LACK OF ENGAGEMENT ON PERSONAL CHAT',
    strategy:
      'Craft an effective pitch by making your initial message a compelling introduction to your cause. Share an attention-grabbing statistic or a powerful story to capture their interest.',
    why: "An engaging initial message is more likely to capture the recipient's interest and can lead to better engagement, as it showcases the importance of your cause right from the start.",
    tip: 'A well-crafted initial message can significantly improve engagement on personal chat.'
  },
  {
    title: '“I\'LL LOOK INTO IT LATER” RESPONSES',
    strategy:
      "Follow up promptly when someone expresses interest but says they'll look into it later. Suggest a specific date or time for your next message to maintain their engagement.",
    why: "Prompt follow-ups show that you're serious about your cause and care about their interest, making it more likely they will engage.",
    tip: 'Timely follow-ups can increase the likelihood of a response and keep the conversation going.'
  },
  {
    title: 'OVERCOMING EXCUSES TO AVOID ENGAGEMENT',
    strategy:
      'Address common concerns by preparing responses for typical excuses or objections potential donors might have. These prepared answers will help you navigate objections and keep the conversation flowing.',
    why: "Prepared responses demonstrate professionalism and indicate that you've considered and are ready to address their concerns, increasing your credibility.",
    tip: "Handling objections with prepared responses can boost your confidence and maintain the conversation's momentum."
  },
  {
    title: 'OVERCOMING SHYNESS',
    strategy:
      "Be confident in your mission. Remember that you're not asking for yourself, but for a cause you believe in. Practice your message to gain fluency and reduce nervousness.",
    why: "Belief in your mission fuels courage. When you're passionate and prepared, your confidence will naturally follow.",
    tip: "Practice your pitch aloud. The more you say it, the more natural and confident you'll become."
  }
];

const icons = [Lightbulb, MessageSquareText, AlertTriangle, Smile];
const iconColors = ['bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-pink-100'];

const CaptureAttention = () => {
  return (
    <div className="px-4 py-12 max-w-5xl mx-auto bg-gradient-to-b from-indigo-50 via-white to-white min-h-screen">
      <h1 className="text-4xl font-bold text-indigo-700 text-center mb-2 tracking-tight">
        CROWDFUNDING
      </h1>
      <h2 className="text-2xl text-gray-800 text-center mb-4 font-semibold">
        Hacks For You
      </h2>
      <h3 className="text-lg font-medium text-center text-gray-600 mb-8">
        Capturing Attention For Your Cause
      </h3>

      <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
        Getting people's attention for your cause is a vital step in successful fundraising.
        To make a meaningful impact, you need to engage and inspire individuals to support
        your mission. Here are some proven techniques to help you connect more effectively.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {sections.map((sec, index) => {
          const Icon = icons[index];
          const bgColor = iconColors[index];

          return (
            <div
              key={index}
              className="bg-white hover:shadow-xl transition-all duration-300 border border-gray-200 rounded-2xl p-6"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-full ${bgColor}`}>
                  <Icon className="text-indigo-600 w-6 h-6" />
                </div>
                <h4 className="text-xl font-semibold text-indigo-700 leading-snug">
                  {sec.title}
                </h4>
              </div>
              <div className="space-y-3 text-gray-700 text-sm md:text-base">
                <p>
                  <span className="font-semibold text-gray-900">Strategy:</span> {sec.strategy}
                </p>
                <p>
                  <span className="font-semibold text-gray-900">Why:</span> {sec.why}
                </p>
                <p>
                  <span className="font-semibold text-gray-900">Tip:</span> {sec.tip}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CaptureAttention;
