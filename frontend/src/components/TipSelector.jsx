import React from 'react';

const TipSelector = ({ tip, setTip, baseAmount }) => {
  const tips = [0, 5, 10, 18];
  const calculateTip = (percentage) =>
    Math.round((baseAmount * percentage) / 100);

  return (
    <select
      value={tip}
      onChange={(e) => setTip(Number(e.target.value))}
      className="w-full md:w-[160px] text-sm px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00b5ad] appearance-none bg-white"
    >
      {tips.map((t) => (
        <option key={t} value={t}>
          {t}% (INR {calculateTip(t)})
        </option>
      ))}
    </select>
  );
};

export default TipSelector;
