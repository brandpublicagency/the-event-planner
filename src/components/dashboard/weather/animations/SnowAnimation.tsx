
import { motion } from 'framer-motion';
import React from 'react';

const SnowAnimation: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div 
          key={i}
          className="absolute h-2 w-2 bg-white rounded-full opacity-70"
          initial={{ 
            x: Math.random() * 100 + '%', 
            y: -10
          }}
          animate={{ 
            y: ['0%', '100%'],
            x: [
              `${Math.random() * 100}%`, 
              `${Math.random() * 100 + 5}%`, 
              `${Math.random() * 100 - 5}%`
            ],
            opacity: [0.8, 0.2]
          }}
          transition={{ 
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

export default SnowAnimation;
