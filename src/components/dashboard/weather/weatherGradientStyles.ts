
interface GradientStyles {
  gradientStyle: React.CSSProperties;
  fallbackGradientClass: string;
}

export const getWeatherGradientStyles = (currentHour: number): GradientStyles => {
  let gradientStyle: React.CSSProperties = {};
  let fallbackGradientClass = "";
  
  // Late Evening (8:00 PM - 9:59 PM)
  if (currentHour >= 20 && currentHour < 22) {
    gradientStyle = {
      background: "linear-gradient(135deg, rgb(75, 85, 99, 0.6), rgb(51, 65, 85, 0.6), rgb(79, 70, 229, 0.5))"
    };
    fallbackGradientClass = "bg-gradient-to-br from-gray-600/40 via-slate-600/40 to-indigo-600/40";
  }
  // Night (10:00 PM - 1:59 AM)
  else if (currentHour >= 22 || currentHour < 2) {
    gradientStyle = {
      background: "linear-gradient(135deg, rgb(31, 41, 55, 0.6), rgb(51, 65, 85, 0.6), rgb(17, 24, 39, 0.6))"
    };
    fallbackGradientClass = "bg-gradient-to-br from-gray-800/40 via-slate-700/40 to-gray-900/40";
  }
  // Deep Night (2:00 AM - 3:59 AM)
  else if (currentHour >= 2 && currentHour < 4) {
    gradientStyle = {
      background: "linear-gradient(135deg, rgb(17, 24, 39, 0.6), rgb(30, 41, 59, 0.6), rgb(49, 46, 129, 0.6))"
    };
    fallbackGradientClass = "bg-gradient-to-br from-gray-900/40 via-slate-800/40 to-indigo-900/40";
  }
  // Pre-Dawn (4:00 AM - 5:59 AM)
  else if (currentHour >= 4 && currentHour < 6) {
    gradientStyle = {
      background: "linear-gradient(135deg, rgb(31, 41, 55, 0.6), rgb(51, 65, 85, 0.6), rgb(79, 70, 229, 0.5))"
    };
    fallbackGradientClass = "bg-gradient-to-br from-gray-800/40 via-slate-700/40 to-indigo-600/40";
  }
  // Early Morning (6:00 AM - 7:59 AM)
  else if (currentHour >= 6 && currentHour < 8) {
    gradientStyle = {
      background: "linear-gradient(135deg, rgb(165, 180, 252, 0.4), rgb(139, 92, 246, 0.4), rgb(248, 113, 113, 0.4))"
    };
    fallbackGradientClass = "bg-gradient-to-br from-indigo-300/40 via-purple-400/40 to-red-400/40";
  } 
  // Morning (8:00 AM - 11:59 AM)
  else if (currentHour >= 8 && currentHour < 12) {
    gradientStyle = {
      background: "linear-gradient(135deg, rgb(125, 211, 252, 0.4), rgb(56, 189, 248, 0.4), rgb(59, 130, 246, 0.4))"
    };
    fallbackGradientClass = "bg-gradient-to-br from-sky-300/40 via-sky-400/40 to-blue-500/40";
  } 
  // Midday (12:00 PM - 3:59 PM)
  else if (currentHour >= 12 && currentHour < 16) {
    gradientStyle = {
      background: "linear-gradient(135deg, rgb(14, 165, 233, 0.4), rgb(6, 182, 212, 0.4), rgb(34, 211, 238, 0.4))"
    };
    fallbackGradientClass = "bg-gradient-to-br from-sky-500/40 via-cyan-500/40 to-cyan-400/40";
  } 
  // Late Afternoon (4:00 PM - 7:59 PM)
  else if (currentHour >= 16 && currentHour < 20) {
    gradientStyle = {
      background: "linear-gradient(135deg, rgb(251, 146, 60, 0.4), rgb(251, 113, 133, 0.4), rgb(99, 102, 241, 0.4))"
    };
    fallbackGradientClass = "bg-gradient-to-br from-orange-400/40 via-pink-400/40 to-indigo-500/40";
  }
  
  return { gradientStyle, fallbackGradientClass };
};
