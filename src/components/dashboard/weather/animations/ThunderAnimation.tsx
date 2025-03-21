
import { motion } from 'framer-motion';
import React from 'react';

const ThunderAnimation: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div 
          key={i}
          className="absolute bg-yellow-300/70 rotate-12 opacity-0"
          style={{
            width: '3px',
            height: '60px',
            left: `${20 + Math.random() * 60}%`,
            top: '10%'
          }}
          animate={{ 
            opacity: [0, 0.9, 0],
            scaleY: [0.3, 1, 0.3]
          }}
          transition={{ 
            duration: 0.3,
            repeat: Infinity,
            repeatDelay: 5 + Math.random() * 10,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
};

export default ThunderAnimation;
