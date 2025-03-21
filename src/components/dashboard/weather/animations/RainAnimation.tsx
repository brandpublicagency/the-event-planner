
import { motion } from 'framer-motion';
import React from 'react';

const RainAnimation: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div 
          key={i}
          className="absolute h-10 w-0.5 bg-white/30 rounded-full"
          initial={{ y: -20, x: Math.random() * 100 + '%' }}
          animate={{ 
            y: ['0%', '100%'],
            opacity: [0.7, 0.3]
          }}
          transition={{ 
            duration: 0.5 + Math.random() * 1.5,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

export default RainAnimation;
