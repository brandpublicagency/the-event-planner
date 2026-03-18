
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
  borderWidth = 1, 
  animationDuration = 6,
  className = '',
  borderRadius = 8,
  colors = ['#FACC15', '#F97316', '#EC4899', '#A855F7', '#3B82F6', '#06B6D4', '#10B981', '#FACC15'],
  isActive = true
}: AnimatedBorderProps) => {
  const [angle, setAngle] = useState(0);
  
  useEffect(() => {
    if (!isActive) return;
    
    const step = 360 / (animationDuration * 50);
    const intervalId = setInterval(() => {
      setAngle(prev => (prev + step) % 360);
    }, 20);
    
    return () => clearInterval(intervalId);
  }, [isActive, animationDuration]);
  
  const gradientString = `linear-gradient(${angle}deg, ${colors.join(', ')})`;
  
  if (!isActive) {
    return <div className={className}>{children}</div>;
  }
  
  return (
    <div className={`relative ${className}`} style={{ padding: borderWidth }}>
      <div 
        className="absolute inset-0"
        style={{ 
          background: gradientString,
          borderRadius: borderRadius + borderWidth,
        }}
      />
      <div className="relative bg-card h-full w-full" style={{ borderRadius }}>
        {children}
      </div>
    </div>
  );
};
