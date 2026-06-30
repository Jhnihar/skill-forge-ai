import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ className = '' }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <button
      onClick={handleBack}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 
        bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 
        text-gray-900 dark:text-gray-100 shadow-sm hover:shadow-md ${className}`}
      aria-label="Go back"
    >
      <span className="text-xl">←</span>
      <span className="hidden sm:inline">Back</span>
    </button>
  );
};

export default BackButton;
