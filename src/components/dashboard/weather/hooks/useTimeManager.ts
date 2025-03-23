
import { useState, useEffect } from 'react';

export interface TimeState {
  timeOfDay: 'morning' | 'day' | 'night';
  currentHour: number;
  currentDateTime: Date;
}

export const useTimeManager = (): TimeState => {
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'day' | 'night'>('day');
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  
  // Update time of day and current hour every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDateTime(now);
      const hour = now.getHours();
      setCurrentHour(hour);
      if (hour >= 5 && hour < 12) {
        setTimeOfDay('morning');
      } else if (hour >= 12 && hour < 18) {
        setTimeOfDay('day');
      } else {
        setTimeOfDay('night');
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);
  
  return { timeOfDay, currentHour, currentDateTime };
};
