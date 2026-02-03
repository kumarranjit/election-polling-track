import React, { useState } from 'react';
import type { VoteCountProps } from '../models/models';

const VoteCounter: React.FC<VoteCountProps> = ({
  initialValue = 0,
  min = 0,
  max = 1500
}) => {
  const [votes, setVotes] = useState<number>(initialValue);
  const [inputValue, setInputValue] = useState<string>(initialValue.toString());

  const decrement = () => {
    const currentValue = inputValue === '' ? 1 : votes;
    const newValue = Math.max(min, currentValue - 1);
    setVotes(newValue);
    setInputValue(newValue.toString());
  };

  const increment = () => {
    const currentValue = inputValue === '' ? 1 : votes;
    const newValue = Math.min(max, currentValue + 1);
    setVotes(newValue);
    setInputValue(newValue.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow digits (0-9) and empty string
    const numericValue = value.replace(/[^0-9]/g, '');
    
    setInputValue(numericValue);
    
    // If empty, don't update votes yet
    if (numericValue === '') {
      return;
    }
    
    const numValue = parseInt(numericValue, 10);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      setVotes(numValue);
    }
  };

  const handleInputBlur = () => {
    if (inputValue === '') {
      setInputValue(votes.toString());
    } else {
      const numValue = parseInt(inputValue, 10);
      if (isNaN(numValue) || numValue < min) {
        setVotes(min);
        setInputValue(min.toString());
      } else if (numValue > max) {
        setVotes(max);
        setInputValue(max.toString());
      } else {
        setVotes(numValue);
      }
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
          disabled={inputValue !== '' && votes <= min}
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
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          className="shrink-0 text-gray-900 border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[3.5rem] text-center"
          placeholder=""
        />
        <button
          type="button"
          id="increment-button"
          onClick={increment}
          className="flex items-center justify-center text-gray-700 bg-gray-100 border border-gray-400 hover:bg-gray-200 hover:text-gray-900 focus:ring-4 focus:ring-gray-200 rounded-full text-sm focus:outline-none h-6 w-6"
          disabled={inputValue !== '' && votes >= max}
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