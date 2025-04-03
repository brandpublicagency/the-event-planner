
import { motion } from 'framer-motion';
import React from 'react';

const RainAnimation: React.FC = () => {
  // Create more raindrops and distribute them better across the width
  const raindrops = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100, // Random x position across 100% of width
    delay: Math.random() * 3, // Random delay for natural effect
    duration: 0.7 + Math.random() * 1.2, // Slightly random durations
    size: Math.random() > 0.7 ? 0.7 : 0.5, // Different sizes for depth effect
    opacity: 0.5 + Math.random() * 0.5 // Varying opacity for depth
  }));
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {raindrops.map((drop) => (
        <motion.div 
          key={drop.id}
          className="absolute bg-sky-100 rounded-full"
          style={{
            height: `${drop.size > 0.6 ? 12 : 8}px`, 
            width: `${drop.size > 0.6 ? 1 : 0.5}px`,
            boxShadow: '0 0 2px rgba(255, 255, 255, 0.5)'
          }}
          initial={{ 
            y: -20, 
            x: `${drop.x}%`,
            opacity: drop.opacity
          }}
          animate={{ 
            y: ['0%', '120%'],
            opacity: [drop.opacity, 0.2]
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
