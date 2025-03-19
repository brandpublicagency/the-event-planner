
import React from 'react';

interface GradientStyles {
  gradientStyle: React.CSSProperties;
  fallbackGradientClass: string;
}

export const getWeatherGradientStyles = (currentHour: number, weatherType?: string): GradientStyles => {
  let gradientStyle: React.CSSProperties = {};
  let fallbackGradientClass = "";
  
  // If we have a weatherType override, use it to determine the gradient
  if (weatherType) {
    const type = weatherType.toLowerCase();
    
    if (type.includes('thunder') || type.includes('lightning')) {
      // Dark gray-purple gradient for thunderstorms
      gradientStyle = {
        background: "linear-gradient(135deg, rgb(30, 41, 59, 0.9), rgb(30, 41, 59, 0.9), rgb(91, 33, 182, 0.8))"
      };
      fallbackGradientClass = "bg-gradient-to-br from-slate-800/90 via-slate-800/90 to-purple-800/80";
      return { gradientStyle, fallbackGradientClass };
    } 
    else if (type.includes('rain') || type.includes('shower') || type.includes('drizzle')) {
      // Blue gradient for rain
      gradientStyle = {
        background: "linear-gradient(135deg, rgb(29, 78, 216, 0.9), rgb(30, 64, 175, 0.9), rgb(17, 24, 39, 0.8))"
      };
      fallbackGradientClass = "bg-gradient-to-br from-blue-700/90 via-blue-800/90 to-gray-900/80";
      return { gradientStyle, fallbackGradientClass };
    } 
    else if (type.includes('snow')) {
      // Light blue-white gradient for snow
      gradientStyle = {
        background: "linear-gradient(135deg, rgb(186, 230, 253, 0.7), rgb(125, 211, 252, 0.7), rgb(56, 189, 248, 0.7))"
      };
      fallbackGradientClass = "bg-gradient-to-br from-sky-100/70 via-sky-300/70 to-sky-400/70";
      return { gradientStyle, fallbackGradientClass };
    }
    else if (type.includes('fog') || type.includes('mist') || type.includes('haze')) {
      // Gray gradient for fog and mist
      gradientStyle = {
        background: "linear-gradient(135deg, rgb(148, 163, 184, 0.8), rgb(100, 116, 139, 0.8), rgb(71, 85, 105, 0.8))"
      };
      fallbackGradientClass = "bg-gradient-to-br from-slate-400/80 via-slate-500/80 to-slate-600/80";
      return { gradientStyle, fallbackGradientClass };
    }
    else if (type.includes('wind')) {
      // Light teal-blue gradient for windy conditions
      gradientStyle = {
        background: "linear-gradient(135deg, rgb(34, 211, 238, 0.7), rgb(6, 182, 212, 0.7), rgb(8, 145, 178, 0.7))"
      };
      fallbackGradientClass = "bg-gradient-to-br from-cyan-400/70 via-cyan-500/70 to-cyan-600/70";
      return { gradientStyle, fallbackGradientClass };
    }
    else if (type.includes('cloud') || type.includes('overcast')) {
      // Gray-blue gradient for cloudy
      gradientStyle = {
        background: "linear-gradient(135deg, rgb(148, 163, 184, 0.8), rgb(100, 116, 139, 0.8), rgb(56, 189, 248, 0.7))"
      };
      fallbackGradientClass = "bg-gradient-to-br from-slate-400/80 via-slate-500/80 to-sky-400/70";
      return { gradientStyle, fallbackGradientClass };
    }
    else if (type.includes('sun') || type.includes('clear')) {
      // Time-dependent sunshine gradients
      if (currentHour >= 6 && currentHour < 10) {
        // Morning sun
        gradientStyle = {
          background: "linear-gradient(135deg, rgb(251, 146, 60, 0.8), rgb(251, 113, 133, 0.7), rgb(217, 70, 239, 0.6))"
        };
        fallbackGradientClass = "bg-gradient-to-br from-orange-400/80 via-rose-400/70 to-fuchsia-500/60";
      } else if (currentHour >= 10 && currentHour < 16) {
        // Midday sun
        gradientStyle = {
          background: "linear-gradient(135deg, rgb(234, 88, 12, 0.8), rgb(251, 146, 60, 0.7), rgb(234, 179, 8, 0.7))"
        };
        fallbackGradientClass = "bg-gradient-to-br from-orange-600/80 via-orange-400/70 to-yellow-500/70";
      } else if (currentHour >= 16 && currentHour < 19) {
        // Afternoon sun
        gradientStyle = {
          background: "linear-gradient(135deg, rgb(249, 115, 22, 0.8), rgb(234, 88, 12, 0.7), rgb(153, 27, 27, 0.7))"
        };
        fallbackGradientClass = "bg-gradient-to-br from-orange-500/80 via-orange-600/70 to-red-800/70";
      } else {
        // Default sun
        gradientStyle = {
          background: "linear-gradient(135deg, rgb(234, 88, 12, 0.8), rgb(251, 146, 60, 0.7), rgb(251, 191, 36, 0.7))"
        };
        fallbackGradientClass = "bg-gradient-to-br from-orange-600/80 via-orange-400/70 to-amber-400/70";
      }
      return { gradientStyle, fallbackGradientClass };
    }
  }
  
  // If no weather type or not a specific match, use time-based gradients
  // Late Evening (8:00 PM - 9:59 PM)
  if (currentHour >= 20 && currentHour < 22) {
    gradientStyle = {
      background: "linear-gradient(135deg, rgb(75, 85, 99, 0.8), rgb(51, 65, 85, 0.8), rgb(99, 102, 241, 0.7))"
    };
    fallbackGradientClass = "bg-gradient-to-br from-gray-600/80 via-slate-600/80 to-indigo-500/70";
  }
  // Night (10:00 PM - 1:59 AM)
  else if (currentHour >= 22 || currentHour < 2) {
    gradientStyle = {
      background: "linear-gradient(135deg, rgb(31, 41, 55, 0.8), rgb(51, 65, 85, 0.8), rgb(17, 24, 39, 0.8))"
    };
    fallbackGradientClass = "bg-gradient-to-br from-gray-800/80 via-slate-700/80 to-gray-900/80";
  }
  // Deep Night (2:00 AM - 3:59 AM)
  else if (currentHour >= 2 && currentHour < 4) {
    gradientStyle = {
      background: "linear-gradient(135deg, rgb(17, 24, 39, 0.8), rgb(30, 41, 59, 0.8), rgb(67, 56, 202, 0.8))"
    };
    fallbackGradientClass = "bg-gradient-to-br from-gray-900/80 via-slate-800/80 to-indigo-700/80";
  }
  // Pre-Dawn (4:00 AM - 5:59 AM)
  else if (currentHour >= 4 && currentHour < 6) {
    gradientStyle = {
      background: "linear-gradient(135deg, rgb(31, 41, 55, 0.8), rgb(51, 65, 85, 0.8), rgb(79, 70, 229, 0.7))"
    };
    fallbackGradientClass = "bg-gradient-to-br from-gray-800/80 via-slate-700/80 to-indigo-600/70";
  }
  // Early Morning (6:00 AM - 7:59 AM)
  else if (currentHour >= 6 && currentHour < 8) {
    gradientStyle = {
      background: "linear-gradient(135deg, rgb(165, 180, 252, 0.7), rgb(139, 92, 246, 0.7), rgb(248, 113, 113, 0.7))"
    };
    fallbackGradientClass = "bg-gradient-to-br from-indigo-300/70 via-purple-400/70 to-red-400/70";
  } 
  // Morning (8:00 AM - 11:59 AM)
  else if (currentHour >= 8 && currentHour < 12) {
    gradientStyle = {
      background: "linear-gradient(135deg, rgb(125, 211, 252, 0.7), rgb(56, 189, 248, 0.7), rgb(59, 130, 246, 0.7))"
    };
    fallbackGradientClass = "bg-gradient-to-br from-sky-300/70 via-sky-400/70 to-blue-500/70";
  } 
  // Midday (12:00 PM - 3:59 PM)
  else if (currentHour >= 12 && currentHour < 16) {
    gradientStyle = {
      background: "linear-gradient(135deg, rgb(14, 165, 233, 0.7), rgb(6, 182, 212, 0.7), rgb(34, 211, 238, 0.7))"
    };
    fallbackGradientClass = "bg-gradient-to-br from-sky-500/70 via-cyan-500/70 to-cyan-400/70";
  } 
  // Late Afternoon (4:00 PM - 7:59 PM)
  else if (currentHour >= 16 && currentHour < 20) {
    gradientStyle = {
      background: "linear-gradient(135deg, rgb(251, 146, 60, 0.7), rgb(251, 113, 133, 0.7), rgb(99, 102, 241, 0.7))"
    };
    fallbackGradientClass = "bg-gradient-to-br from-orange-400/70 via-pink-400/70 to-indigo-500/70";
  }
  
  return { gradientStyle, fallbackGradientClass };
};
