
import { useEffect } from 'react';

export const useHoverStyles = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .day-card-hover:hover {
        background-color: rgba(255, 255, 255, 0.1);
        transform: translateY(-2px);
        transition: all 0.3s ease;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
};
