
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
      background: "linear-gradient(135deg, rgb(75, 85, 99), rgb(51, 65, 85), rgb(55, 48, 163))"
    };
    fallbackGradientClass = "bg-gradient-to-r from-gray-600 via-slate-600 to-indigo-800";
  }
  // Night (10:00 PM - 1:59 AM)
  else if (currentHour >= 22 || currentHour < 2) {
    gradientStyle = {
      background: "linear-gradient(135deg, rgb(31, 41, 55), rgb(51, 65, 85), rgb(17, 24, 39))"
    };
    fallbackGradientClass = "bg-gradient-to-r from-gray-800 via-slate-700 to-gray-900";
  }
  // Deep Night (2:00 AM - 3:59 AM)
  else if (currentHour >= 2 && currentHour < 4) {
    gradientStyle = {
      background: "linear-gradient(135deg, rgb(17, 24, 39), rgb(30, 41, 59), rgb(30, 27, 75))"
    };
    fallbackGradientClass = "bg-gradient-to-r from-gray-900 via-slate-800 to-indigo-950";
  }
  // Pre-Dawn (4:00 AM - 5:59 AM)
  else if (currentHour >= 4 && currentHour < 6) {
    gradientStyle = {
      background: "linear-gradient(135deg, rgb(31, 41, 55), rgb(51, 65, 85), rgb(49, 46, 129))"
    };
    fallbackGradientClass = "bg-gradient-to-r from-gray-800 via-slate-700 to-indigo-900";
  }
  // Early Morning (6:00 AM - 7:59 AM)
  else if (currentHour >= 6 && currentHour < 8) {
    gradientStyle = {
      background: "linear-gradient(135deg, rgb(209, 213, 219), rgb(203, 213, 225), rgb(199, 210, 254))"
    };
    fallbackGradientClass = "bg-gradient-to-r from-gray-300 via-slate-300 to-indigo-200";
  } 
  // Morning (8:00 AM - 11:59 AM)
  else if (currentHour >= 8 && currentHour < 12) {
    gradientStyle = {
      background: "linear-gradient(135deg, rgb(219, 234, 254), rgb(186, 230, 253), rgb(224, 231, 255))"
    };
    fallbackGradientClass = "bg-gradient-to-r from-blue-100 via-sky-200 to-indigo-100";
  } 
  // Midday (12:00 PM - 3:59 PM)
  else if (currentHour >= 12 && currentHour < 16) {
    gradientStyle = {
      background: "linear-gradient(135deg, rgb(186, 230, 253), rgb(191, 219, 254), rgb(207, 250, 254))"
    };
    fallbackGradientClass = "bg-gradient-to-r from-sky-200 via-blue-200 to-cyan-100";
  } 
  // Late Afternoon (4:00 PM - 7:59 PM)
  else if (currentHour >= 16 && currentHour < 20) {
    gradientStyle = {
      background: "linear-gradient(135deg, rgb(254, 243, 199), rgb(255, 237, 213), rgb(219, 234, 254))"
    };
    fallbackGradientClass = "bg-gradient-to-r from-amber-100 via-orange-100 to-blue-100";
  }
  
  return { gradientStyle, fallbackGradientClass };
};
