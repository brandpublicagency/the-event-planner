
interface GradientStyle {
  background: string;
}

interface WeatherGradientResult {
  gradientStyle: GradientStyle;
  fallbackGradientClass: string;
}

// Function to get gradient styles based on weather condition and time of day
export const getWeatherGradientStyles = (
  timeOfDay: string,
  weatherCondition?: string
): WeatherGradientResult => {
  console.log("Getting gradient for", timeOfDay, weatherCondition);
  
  // Default gradient (clear day)
  let gradient = "linear-gradient(to bottom right, #4facfe 0%, #00f2fe 100%)";
  let fallbackClass = "bg-blue-500";
  
  // Handle different time periods
  if (timeOfDay === 'morning') {
    if (weatherCondition?.includes('cloud')) {
      gradient = "linear-gradient(to bottom right, #5d6d7e 0%, #8aa4be 100%)";
      fallbackClass = "bg-gray-400";
    } else if (weatherCondition?.includes('rain') || weatherCondition?.includes('shower') || weatherCondition?.includes('drizzle')) {
      gradient = "linear-gradient(to bottom right, #616f7e 0%, #3a7bd5 100%)";
      fallbackClass = "bg-blue-600";
    } else if (weatherCondition?.includes('thunder')) {
      gradient = "linear-gradient(to bottom right, #33435c 0%, #5b6d94 100%)";
      fallbackClass = "bg-gray-700";
    } else if (weatherCondition?.includes('snow')) {
      gradient = "linear-gradient(to bottom right, #b8c6db 0%, #e7edf6 100%)";
      fallbackClass = "bg-blue-100";
    } else if (weatherCondition?.includes('fog') || weatherCondition?.includes('mist')) {
      gradient = "linear-gradient(to bottom right, #b3bac0 0%, #d9dee2 100%)";
      fallbackClass = "bg-gray-300";
    } else {
      // Clear morning
      gradient = "linear-gradient(to bottom right, #ff9a9e 0%, #fad0c4 100%)";
      fallbackClass = "bg-orange-300";
    }
  } else if (timeOfDay === 'day') {
    if (weatherCondition?.includes('cloud')) {
      gradient = "linear-gradient(to bottom right, #89a7d2 0%, #b6cce8 100%)";
      fallbackClass = "bg-blue-300";
    } else if (weatherCondition?.includes('rain') || weatherCondition?.includes('shower') || weatherCondition?.includes('drizzle')) {
      gradient = "linear-gradient(to bottom right, #4b6cb7 0%, #5d97cc 100%)";
      fallbackClass = "bg-blue-600";
    } else if (weatherCondition?.includes('thunder')) {
      gradient = "linear-gradient(to bottom right, #373B44 0%, #4286f4 100%)";
      fallbackClass = "bg-blue-700";
    } else if (weatherCondition?.includes('snow')) {
      gradient = "linear-gradient(to bottom right, #e3eeff 0%, #f3f4f6 100%)";
      fallbackClass = "bg-gray-100";
    } else if (weatherCondition?.includes('fog') || weatherCondition?.includes('mist')) {
      gradient = "linear-gradient(to bottom right, #d0d4da 0%, #eef1f5 100%)";
      fallbackClass = "bg-gray-200";
    } else {
      // Clear day
      gradient = "linear-gradient(to bottom right, #4facfe 0%, #00f2fe 100%)";
      fallbackClass = "bg-blue-500";
    }
  } else {
    // Night
    if (weatherCondition?.includes('cloud')) {
      gradient = "linear-gradient(to bottom right, #283048 0%, #455176 100%)";
      fallbackClass = "bg-gray-800";
    } else if (weatherCondition?.includes('rain') || weatherCondition?.includes('shower') || weatherCondition?.includes('drizzle')) {
      gradient = "linear-gradient(to bottom right, #10192c 0%, #2a3852 100%)";
      fallbackClass = "bg-blue-900";
    } else if (weatherCondition?.includes('thunder')) {
      gradient = "linear-gradient(to bottom right, #0f0c29 0%, #302b63 100%)";
      fallbackClass = "bg-indigo-900";
    } else if (weatherCondition?.includes('snow')) {
      gradient = "linear-gradient(to bottom right, #2c3e50 0%, #4c6885 100%)";
      fallbackClass = "bg-slate-700";
    } else if (weatherCondition?.includes('fog') || weatherCondition?.includes('mist')) {
      gradient = "linear-gradient(to bottom right, #363e49 0%, #596579 100%)";
      fallbackClass = "bg-gray-600";
    } else {
      // Clear night
      gradient = "linear-gradient(to bottom right, #0a2342 0%, #2c3e50 100%)";
      fallbackClass = "bg-blue-900";
    }
  }
  
  return {
    gradientStyle: { background: gradient },
    fallbackGradientClass: fallbackClass
  };
};
