import React, { useEffect, useMemo, useState } from 'react';
import type { VoteCountProps } from '../models/models';

type VoteCounterProps = VoteCountProps & {
  value?: number;
  onChange?: (value: number) => void;
};

const VoteCounter: React.FC<VoteCounterProps> = ({
  initialValue = 0,
  min = 0,
  max = 1500,
  value,
  onChange,
}) => {
  const isControlled = useMemo(() => value !== undefined, [value]);
  const [votes, setVotes] = useState<number>(value ?? initialValue);
  const [inputValue, setInputValue] = useState<string>(String(value ?? initialValue));

  useEffect(() => {
    if (!isControlled) return;
    setVotes(value ?? 0);
    setInputValue(String(value ?? 0));
  }, [isControlled, value]);

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
      onChange?.(numValue);
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
        onChange?.(min);
      } else if (numValue > max) {
        setVotes(max);
        setInputValue(max.toString());
        onChange?.(max);
      } else {
        setVotes(numValue);
        onChange?.(numValue);
      }
    }
  };

  return (
    <form className="max-w-xs mx-auto">
      <label htmlFor="counter-input" className="sr-only">
        Choose quantity:
      </label>
      <div className="relative flex items-center">
        
        <input
          type="text"
          inputMode="numeric"
          id="counter-input"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          className="shrink-0 w-16 min-w-[3.5rem] h-8 mx-2 px-2 text-center text-base font-semibold text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors placeholder:text-gray-400"
          placeholder="0"
          aria-label="Vote count"
        />
        
      </div>
    </form>
  );
};

export default VoteCounter;