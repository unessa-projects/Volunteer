import React from 'react';

const AmountSelector = ({
  presetAmounts,
  amount,
  setAmount,
  customAmount,
  setCustomAmount,
}) => {
  const selectedAmount = customAmount ? +customAmount : amount;

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="flex gap-6">
        {presetAmounts.map((amt) => (
          <button
            key={amt}
            className={`px-5 py-1 rounded-full text-lg font-medium shadow-md transition 
              ${selectedAmount === amt && customAmount === ''
                ? 'bg-[#00b5ad] text-white shadow-lg'
                : 'bg-white text-gray-800 border border-gray-200 hover:border-[#00b5ad]'}`}
            onClick={() => {
              setCustomAmount('');
              setAmount(amt);
            }}
          >
            ₹{amt}
          </button>
        ))}
      </div>

      <input
        type="number"
        placeholder="Other Amount"
        className={`w-40 text-center px-4 py-2 text-sm rounded-full shadow-md 
          border ${customAmount ? 'border-[#00b5ad]' : 'border-gray-200'} 
          focus:outline-none focus:ring-2 focus:ring-[#00b5ad]`}
        value={customAmount}
        onChange={(e) => {
          setCustomAmount(e.target.value);
          setAmount(0);
        }}
      />
    </div>
  );
};

export default AmountSelector;
