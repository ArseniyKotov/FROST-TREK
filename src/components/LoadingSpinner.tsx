import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-40">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 right-0 bottom-0 border-4 border-neon-blue rounded-full animate-pulse"></div>
        <div className="absolute top-2 left-2 right-2 bottom-2 border-4 border-neon-pink rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="absolute top-4 left-4 right-4 bottom-4 border-4 border-neon-purple rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
