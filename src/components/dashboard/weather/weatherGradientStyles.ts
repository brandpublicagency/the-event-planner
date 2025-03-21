
import React from 'react';

// Define a proper type for the gradient styles
export interface GradientStyles {
  background: string;
}

export const getWeatherGradientStyles = (
  timeOfDay: string,
  weatherType?: string
): GradientStyles => {
  let gradientStyle: GradientStyles = {
    background: "linear-gradient(135deg, rgb(14, 165, 233, 0.7), rgb(6, 182, 212, 0.7), rgb(34, 211, 238, 0.7))"
  };
  
  // If we have a weatherType override, use it to determine the gradient
  if (weatherType) {
    const type = weatherType.toLowerCase();
    
    if (type.includes('thunder') || type.includes('lightning')) {
      // Dark gray-purple gradient for thunderstorms
      gradientStyle = {
        background: "linear-gradient(135deg, rgb(30, 41, 59, 0.9), rgb(30, 41, 59, 0.9), rgb(91, 33, 182, 0.8))"
      };
      return gradientStyle;
    } 
    else if (type.includes('rain') || type.includes('shower') || type.includes('drizzle')) {
      // Blue gradient for rain
      gradientStyle = {
        background: "linear-gradient(135deg, rgb(29, 78, 216, 0.9), rgb(30, 64, 175, 0.9), rgb(17, 24, 39, 0.8))"
      };
      return gradientStyle;
    } 
    else if (type.includes('snow')) {
      // Light blue-white gradient for snow
      gradientStyle = {
        background: "linear-gradient(135deg, rgb(186, 230, 253, 0.7), rgb(125, 211, 252, 0.7), rgb(56, 189, 248, 0.7))"
      };
      return gradientStyle;
    }
    else if (type.includes('fog') || type.includes('mist') || type.includes('haze')) {
      // Gray gradient for fog and mist
      gradientStyle = {
        background: "linear-gradient(135deg, rgb(148, 163, 184, 0.8), rgb(100, 116, 139, 0.8), rgb(71, 85, 105, 0.8))"
      };
      return gradientStyle;
    }
    else if (type.includes('wind')) {
      // Light teal-blue gradient for windy conditions
      gradientStyle = {
        background: "linear-gradient(135deg, rgb(34, 211, 238, 0.7), rgb(6, 182, 212, 0.7), rgb(8, 145, 178, 0.7))"
      };
      return gradientStyle;
    }
    else if (type.includes('cloud') || type.includes('overcast')) {
      // Gray-blue gradient for cloudy
      gradientStyle = {
        background: "linear-gradient(135deg, rgb(148, 163, 184, 0.8), rgb(100, 116, 139, 0.8), rgb(56, 189, 248, 0.7))"
      };
      return gradientStyle;
    }
    else if (type.includes('sun') || type.includes('clear')) {
      // Time-dependent sunshine gradients
      if (timeOfDay === 'morning') {
        // Morning sun
        gradientStyle = {
          background: "linear-gradient(135deg, rgb(251, 146, 60, 0.8), rgb(251, 113, 133, 0.7), rgb(217, 70, 239, 0.6))"
        };
      } else if (timeOfDay === 'day') {
        // Midday sun
        gradientStyle = {
          background: "linear-gradient(135deg, rgb(234, 88, 12, 0.8), rgb(251, 146, 60, 0.7), rgb(234, 179, 8, 0.7))"
        };
      } else if (timeOfDay === 'evening') {
        // Afternoon sun
        gradientStyle = {
          background: "linear-gradient(135deg, rgb(249, 115, 22, 0.8), rgb(234, 88, 12, 0.7), rgb(153, 27, 27, 0.7))"
        };
      } else {
        // Default sun
        gradientStyle = {
          background: "linear-gradient(135deg, rgb(234, 88, 12, 0.8), rgb(251, 146, 60, 0.7), rgb(251, 191, 36, 0.7))"
        };
      }
      return gradientStyle;
    }
  }
  
  // If no weather type or not a specific match, use time-based gradients
  if (timeOfDay === 'night') {
    gradientStyle = {
      background: "linear-gradient(135deg, rgb(31, 41, 55, 0.8), rgb(51, 65, 85, 0.8), rgb(17, 24, 39, 0.8))"
    };
  } else if (timeOfDay === 'morning') {
    gradientStyle = {
      background: "linear-gradient(135deg, rgb(165, 180, 252, 0.7), rgb(139, 92, 246, 0.7), rgb(248, 113, 113, 0.7))"
    };
  } else if (timeOfDay === 'day') {
    gradientStyle = {
      background: "linear-gradient(135deg, rgb(125, 211, 252, 0.7), rgb(56, 189, 248, 0.7), rgb(59, 130, 246, 0.7))"
    };
  } else if (timeOfDay === 'evening') {
    gradientStyle = {
      background: "linear-gradient(135deg, rgb(251, 146, 60, 0.7), rgb(251, 113, 133, 0.7), rgb(99, 102, 241, 0.7))"
    };
  }
  
  return gradientStyle;
};
