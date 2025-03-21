
import React from 'react';

// Define a proper type for the gradient styles
export interface GradientStyles {
  background: string;
  fallbackGradientClass?: string;
}

export const getWeatherGradientStyles = (
  timeOfDay: string | number,
  weatherType?: string
): { gradientStyle: GradientStyles; fallbackGradientClass: string } => {
  // Convert timeOfDay to proper format if it's a number (hour)
  let timeOfDayString: string = typeof timeOfDay === 'number' 
    ? getTimeOfDayFromHour(timeOfDay) 
    : timeOfDay;
  
  let gradientStyle: GradientStyles = {
    background: "linear-gradient(135deg, rgb(14, 165, 233, 0.7), rgb(6, 182, 212, 0.7), rgb(34, 211, 238, 0.7))"
  };
  
  let fallbackGradientClass = "bg-blue-500/40";
  
  // If we have a weatherType override, use it to determine the gradient
  if (weatherType) {
    const type = weatherType.toLowerCase();
    
    if (type.includes('thunder') || type.includes('lightning')) {
      // Dark gray-purple gradient for thunderstorms
      gradientStyle = {
        background: "linear-gradient(135deg, rgb(30, 41, 59, 0.9), rgb(30, 41, 59, 0.9), rgb(91, 33, 182, 0.8))"
      };
      fallbackGradientClass = "bg-slate-800/90";
      return { gradientStyle, fallbackGradientClass };
    } 
    else if (type.includes('rain') || type.includes('shower') || type.includes('drizzle')) {
      // Blue gradient for rain
      gradientStyle = {
        background: "linear-gradient(135deg, rgb(29, 78, 216, 0.9), rgb(30, 64, 175, 0.9), rgb(17, 24, 39, 0.8))"
      };
      fallbackGradientClass = "bg-blue-800/80";
      return { gradientStyle, fallbackGradientClass };
    } 
    else if (type.includes('snow')) {
      // Light blue-white gradient for snow
      gradientStyle = {
        background: "linear-gradient(135deg, rgb(186, 230, 253, 0.7), rgb(125, 211, 252, 0.7), rgb(56, 189, 248, 0.7))"
      };
      fallbackGradientClass = "bg-sky-200/70";
      return { gradientStyle, fallbackGradientClass };
    }
    else if (type.includes('fog') || type.includes('mist') || type.includes('haze')) {
      // Gray gradient for fog and mist
      gradientStyle = {
        background: "linear-gradient(135deg, rgb(148, 163, 184, 0.8), rgb(100, 116, 139, 0.8), rgb(71, 85, 105, 0.8))"
      };
      fallbackGradientClass = "bg-slate-400/70";
      return { gradientStyle, fallbackGradientClass };
    }
    else if (type.includes('wind')) {
      // Light teal-blue gradient for windy conditions
      gradientStyle = {
        background: "linear-gradient(135deg, rgb(34, 211, 238, 0.7), rgb(6, 182, 212, 0.7), rgb(8, 145, 178, 0.7))"
      };
      fallbackGradientClass = "bg-cyan-500/70";
      return { gradientStyle, fallbackGradientClass };
    }
    else if (type.includes('cloud') || type.includes('overcast')) {
      // Gray-blue gradient for cloudy
      gradientStyle = {
        background: "linear-gradient(135deg, rgb(148, 163, 184, 0.8), rgb(100, 116, 139, 0.8), rgb(56, 189, 248, 0.7))"
      };
      fallbackGradientClass = "bg-slate-400/70";
      return { gradientStyle, fallbackGradientClass };
    }
    else if (type.includes('sun') || type.includes('clear')) {
      // Time-dependent sunshine gradients
      if (timeOfDayString === 'morning') {
        // Morning sun
        gradientStyle = {
          background: "linear-gradient(135deg, rgb(251, 146, 60, 0.8), rgb(251, 113, 133, 0.7), rgb(217, 70, 239, 0.6))"
        };
        fallbackGradientClass = "bg-orange-400/70";
      } else if (timeOfDayString === 'day') {
        // Midday sun
        gradientStyle = {
          background: "linear-gradient(135deg, rgb(234, 88, 12, 0.8), rgb(251, 146, 60, 0.7), rgb(234, 179, 8, 0.7))"
        };
        fallbackGradientClass = "bg-amber-500/70";
      } else if (timeOfDayString === 'evening') {
        // Afternoon sun
        gradientStyle = {
          background: "linear-gradient(135deg, rgb(249, 115, 22, 0.8), rgb(234, 88, 12, 0.7), rgb(153, 27, 27, 0.7))"
        };
        fallbackGradientClass = "bg-orange-600/70";
      } else {
        // Default sun
        gradientStyle = {
          background: "linear-gradient(135deg, rgb(234, 88, 12, 0.8), rgb(251, 146, 60, 0.7), rgb(251, 191, 36, 0.7))"
        };
        fallbackGradientClass = "bg-amber-500/70";
      }
      return { gradientStyle, fallbackGradientClass };
    }
  }
  
  // If no weather type or not a specific match, use time-based gradients
  if (timeOfDayString === 'night') {
    gradientStyle = {
      background: "linear-gradient(135deg, rgb(31, 41, 55, 0.8), rgb(51, 65, 85, 0.8), rgb(17, 24, 39, 0.8))"
    };
    fallbackGradientClass = "bg-slate-900/80";
  } else if (timeOfDayString === 'morning') {
    gradientStyle = {
      background: "linear-gradient(135deg, rgb(165, 180, 252, 0.7), rgb(139, 92, 246, 0.7), rgb(248, 113, 113, 0.7))"
    };
    fallbackGradientClass = "bg-indigo-300/70";
  } else if (timeOfDayString === 'day') {
    gradientStyle = {
      background: "linear-gradient(135deg, rgb(125, 211, 252, 0.7), rgb(56, 189, 248, 0.7), rgb(59, 130, 246, 0.7))"
    };
    fallbackGradientClass = "bg-sky-400/70";
  } else if (timeOfDayString === 'evening') {
    gradientStyle = {
      background: "linear-gradient(135deg, rgb(251, 146, 60, 0.7), rgb(251, 113, 133, 0.7), rgb(99, 102, 241, 0.7))"
    };
    fallbackGradientClass = "bg-orange-400/70";
  }
  
  return { gradientStyle, fallbackGradientClass };
};

// Helper function to convert hour to time of day
function getTimeOfDayFromHour(hour: number): string {
  if (hour >= 5 && hour < 12) {
    return 'morning';
  } else if (hour >= 12 && hour < 18) {
    return 'day';
  } else if (hour >= 18 && hour < 22) {
    return 'evening';
  } else {
    return 'night';
  }
}
