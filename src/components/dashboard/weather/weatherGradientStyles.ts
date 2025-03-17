
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
      background: "linear-gradient(135deg, rgb(75, 85, 99), rgb(51, 65, 85), rgb(79, 70, 229))"
    };
    fallbackGradientClass = "bg-gradient-to-br from-gray-600 via-slate-600 to-indigo-600";
  }
  // Night (10:00 PM - 1:59 AM)
  else if (currentHour >= 22 || currentHour < 2) {
    gradientStyle = {
      background: "linear-gradient(135deg, rgb(31, 41, 55), rgb(51, 65, 85), rgb(17, 24, 39))"
    };
    fallbackGradientClass = "bg-gradient-to-br from-gray-800 via-slate-700 to-gray-900";
  }
  // Deep Night (2:00 AM - 3:59 AM)
  else if (currentHour >= 2 && currentHour < 4) {
    gradientStyle = {
      background: "linear-gradient(135deg, rgb(17, 24, 39), rgb(30, 41, 59), rgb(49, 46, 129))"
    };
    fallbackGradientClass = "bg-gradient-to-br from-gray-900 via-slate-800 to-indigo-900";
  }
  // Pre-Dawn (4:00 AM - 5:59 AM)
  else if (currentHour >= 4 && currentHour < 6) {
    gradientStyle = {
      background: "linear-gradient(135deg, rgb(31, 41, 55), rgb(51, 65, 85), rgb(79, 70, 229))"
    };
    fallbackGradientClass = "bg-gradient-to-br from-gray-800 via-slate-700 to-indigo-600";
  }
  // Early Morning (6:00 AM - 7:59 AM)
  else if (currentHour >= 6 && currentHour < 8) {
    gradientStyle = {
      background: "linear-gradient(135deg, rgb(165, 180, 252), rgb(139, 92, 246), rgb(248, 113, 113))"
    };
    fallbackGradientClass = "bg-gradient-to-br from-indigo-300 via-purple-400 to-red-400";
  } 
  // Morning (8:00 AM - 11:59 AM)
  else if (currentHour >= 8 && currentHour < 12) {
    gradientStyle = {
      background: "linear-gradient(135deg, rgb(125, 211, 252), rgb(56, 189, 248), rgb(59, 130, 246))"
    };
    fallbackGradientClass = "bg-gradient-to-br from-sky-300 via-sky-400 to-blue-500";
  } 
  // Midday (12:00 PM - 3:59 PM)
  else if (currentHour >= 12 && currentHour < 16) {
    gradientStyle = {
      background: "linear-gradient(135deg, rgb(14, 165, 233), rgb(6, 182, 212), rgb(34, 211, 238))"
    };
    fallbackGradientClass = "bg-gradient-to-br from-sky-500 via-cyan-500 to-cyan-400";
  } 
  // Late Afternoon (4:00 PM - 7:59 PM)
  else if (currentHour >= 16 && currentHour < 20) {
    gradientStyle = {
      background: "linear-gradient(135deg, rgb(251, 146, 60), rgb(251, 113, 133), rgb(99, 102, 241))"
    };
    fallbackGradientClass = "bg-gradient-to-br from-orange-400 via-pink-400 to-indigo-500";
  }
  
  return { gradientStyle, fallbackGradientClass };
};
