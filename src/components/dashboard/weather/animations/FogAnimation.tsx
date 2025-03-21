
import { motion } from 'framer-motion';
import React from 'react';

const FogAnimation: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div 
          key={i}
          className="absolute bg-white/20 rounded-full"
          style={{
            width: `${80 + Math.random() * 100}px`,
            height: `${20 + Math.random() * 30}px`,
            left: `${-20 + Math.random() * 120}%`,
            top: `${10 + Math.random() * 80}%`
          }}
          animate={{ 
            x: ['-5%', '5%', '-5%'],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 8 + Math.random() * 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export default FogAnimation;
