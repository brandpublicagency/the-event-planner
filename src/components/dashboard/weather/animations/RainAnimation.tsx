
import { motion } from 'framer-motion';
import React from 'react';

const RainAnimation: React.FC = () => {
  // Create more raindrops with better distribution across the entire width
  const raindrops = Array.from({ length: 100 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100, // Random x position across 100% of width
    delay: Math.random() * 2, // Randomized delay for natural effect
    duration: 0.7 + Math.random() * 1, // Varying drop speeds
    size: Math.random() > 0.7 ? 2 : 1.2, // Different sizes for depth effect
    opacity: 0.7 + Math.random() * 0.3 // Higher opacity for better visibility
  }));
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 w-full h-full">
      {raindrops.map((drop) => (
        <motion.div 
          key={drop.id}
          className="absolute bg-blue-100"
          style={{
            height: `${drop.size > 1.5 ? 20 : 15}px`, 
            width: `${drop.size > 1.5 ? 2 : 1.5}px`,
            borderRadius: '1px',
            boxShadow: '0 0 4px rgba(255, 255, 255, 0.8)',
            top: '-20px', // Start above the container
            left: `${drop.x}%`,
            opacity: drop.opacity,
            zIndex: 5
          }}
          initial={{ 
            y: -20,
          }}
          animate={{ 
            y: ['0%', '120%'],
            opacity: [drop.opacity, 0.4]
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
