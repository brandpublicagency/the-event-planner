
import { motion } from 'framer-motion';
import React from 'react';

const RainAnimation: React.FC = () => {
  // Create more raindrops with better distribution across the entire width
  const raindrops = Array.from({ length: 60 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100, // Random x position across 100% of width
    delay: Math.random() * 2, // Randomized delay for natural effect
    duration: 0.8 + Math.random() * 1.2, // Varying drop speeds
    size: Math.random() > 0.7 ? 1.4 : 0.9, // Different sizes for depth effect
    opacity: 0.6 + Math.random() * 0.4 // Higher opacity for better visibility
  }));
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 w-full h-full">
      {raindrops.map((drop) => (
        <motion.div 
          key={drop.id}
          className="absolute bg-sky-100"
          style={{
            height: `${drop.size > 1 ? 14 : 10}px`, 
            width: `${drop.size > 1 ? 1.5 : 1}px`,
            borderRadius: '2px',
            boxShadow: '0 0 3px rgba(255, 255, 255, 0.7)',
            top: '-10px', // Start slightly above the container
            left: `${drop.x}%`,
          }}
          initial={{ 
            y: -20,
            opacity: drop.opacity
          }}
          animate={{ 
            y: ['0%', '120%'],
            opacity: [drop.opacity, 0.3]
          }}
          transition={{ 
            duration: drop.duration,
            repeat: Infinity,
            delay: drop.delay,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

export default RainAnimation;
