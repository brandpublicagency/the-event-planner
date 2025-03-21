
import { motion } from 'framer-motion';
import React from 'react';

const WindAnimation: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div 
          key={i}
          className="absolute bg-white/10 rounded-sm"
          style={{
            width: `${30 + Math.random() * 70}px`,
            height: '2px',
            left: '-10%',
            top: `${10 + Math.random() * 80}%`
          }}
          animate={{ 
            x: ['-10%', '120%'],
            opacity: [0, 0.7, 0]
          }}
          transition={{ 
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export default WindAnimation;
