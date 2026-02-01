import React, { useState } from 'react';

interface VoteCountProps {
  initialValue?: number;
  min?: number;
  max?: number;
}

const VoteCounter: React.FC<VoteCountProps> = ({
  initialValue = 0,
  min = 0,
  max = 10000
}) => {
  const [votes, setVotes] = useState<number>(initialValue);

  const decrement = () => {
    setVotes(prev => Math.max(min, prev - 1));
  };

  const increment = () => {
    setVotes(prev => Math.min(max, prev + 1));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= min && value <= max) {
      setVotes(value);
    }
  };

  return (
    <form className="max-w-xs mx-auto">
      <label htmlFor="counter-input" className="sr-only">
        Choose quantity:
      </label>
      <div className="relative flex items-center">
        <button
          type="button"
          id="decrement-button"
          onClick={decrement}
          className="flex items-center justify-center text-gray-700 bg-gray-100 border border-gray-400 hover:bg-gray-200 hover:text-gray-900 focus:ring-4 focus:ring-gray-200 rounded-full text-sm focus:outline-none h-6 w-6"
          disabled={votes <= min}
        >
          <svg
            className="w-3 h-3 text-gray-900"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 12h14"
            />
          </svg>
        </button>
        <input
          type="text"
          id="counter-input"
          value={votes}
          onChange={handleInputChange}
          className="shrink-0 text-gray-900 border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[3.5rem] text-center"
          required
        />
        <button
          type="button"
          id="increment-button"
          onClick={increment}
          className="flex items-center justify-center text-gray-700 bg-gray-100 border border-gray-400 hover:bg-gray-200 hover:text-gray-900 focus:ring-4 focus:ring-gray-200 rounded-full text-sm focus:outline-none h-6 w-6"
          disabled={votes >= max}
        >
          <svg
            className="w-3 h-3 text-gray-900"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 12h14m-7 7V5"
            />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default VoteCounter;