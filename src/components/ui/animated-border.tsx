
import React, { useState, useEffect } from 'react';

interface AnimatedBorderProps {
  children: React.ReactNode;
  borderWidth?: number;
  animationDuration?: number;
  className?: string;
  borderRadius?: number;
  colors?: string[];
  isActive?: boolean;
}

export const AnimatedBorder = ({ 
  children, 
  borderWidth = 4, 
  animationDuration = 4,
  className = '',
  borderRadius = 8,
  colors = ['#FFA500', '#FF6347', '#FF4500', '#FF1493', '#FF00FF', '#8A2BE2', '#4169E1', '#1E90FF', '#00BFFF'],
  isActive = true
}: AnimatedBorderProps) => {
  const [angle, setAngle] = useState(0);
  
  useEffect(() => {
    if (!isActive) return;
    
    const intervalId = setInterval(() => {
      setAngle(prevAngle => (prevAngle + 1) % 360);
    }, 20);
    
    return () => clearInterval(intervalId);
  }, [isActive]);
  
  // Create the gradient string
  const gradientString = `linear-gradient(${angle}deg, ${colors.join(', ')})`;
  
  if (!isActive) {
    return <div className={className}>{children}</div>;
  }
  
  return (
    <div className={`relative ${className}`} style={{ padding: borderWidth }}>
      {/* Animated border background */}
      <div 
        className="absolute inset-0 animate-pulse"
        style={{ 
          background: gradientString,
          borderRadius: borderRadius + borderWidth,
          animation: `pulse ${animationDuration}s infinite`
        }}
      />
      
      {/* Content container */}
      <div className="relative bg-white h-full w-full" style={{ borderRadius }}>
        {children}
      </div>
    </div>
  );
};
