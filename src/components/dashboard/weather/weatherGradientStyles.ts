
// This file provides gradient styles for different weather conditions based on time of day

// Define time phases (in hours, using 24-hour format)
const DAWN_START = 5;
const DAWN_END = 8;
const MORNING_START = 8;
const MORNING_END = 11;
const MIDDAY_START = 11;
const MIDDAY_END = 14;
const AFTERNOON_START = 14;
const AFTERNOON_END = 17;
const SUNSET_START = 17;
const SUNSET_END = 20;
// Night is 20:00 - 5:00

// Types
type TimePeriod = 'morning' | 'day' | 'night';
type TimePhase = 'dawn' | 'morning' | 'midday' | 'afternoon' | 'sunset' | 'night';

// Clear sky gradients for different times of day
const clearGradients = {
  dawn: {
    background: "linear-gradient(to right bottom, rgb(49, 46, 129), rgb(168, 85, 247), rgb(249, 115, 22))",
    fallbackClass: "bg-gradient-to-br from-indigo-900 via-pink-600 to-orange-500"
  },
  morning: {
    background: "linear-gradient(to right bottom, rgb(249, 115, 22), rgb(125, 211, 252), rgb(56, 189, 248))",
    fallbackClass: "bg-gradient-to-br from-orange-500 via-sky-300 to-sky-400"
  },
  midday: {
    background: "linear-gradient(to right bottom, rgb(56, 189, 248), rgb(14, 165, 233), rgb(59, 130, 246))",
    fallbackClass: "bg-gradient-to-br from-sky-400 via-sky-500 to-blue-500"
  },
  afternoon: {
    background: "linear-gradient(to right bottom, rgb(59, 130, 246), rgb(56, 189, 248), rgb(217, 119, 6))",
    fallbackClass: "bg-gradient-to-br from-blue-500 via-sky-400 to-amber-300"
  },
  sunset: {
    background: "linear-gradient(to right bottom, rgb(245, 158, 11), rgb(234, 88, 12), rgb(49, 46, 129))",
    fallbackClass: "bg-gradient-to-br from-amber-500 via-orange-600 to-indigo-900"
  },
  night: {
    background: "linear-gradient(to right bottom, rgb(15, 23, 42), rgb(30, 27, 75), rgb(15, 23, 42))",
    fallbackClass: "bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900"
  }
};

// Cloudy gradients for different times of day
const cloudyGradients = {
  dawn: {
    background: "linear-gradient(to right bottom, rgb(51, 65, 85), rgb(100, 116, 139), rgb(148, 163, 184))",
    fallbackClass: "bg-gradient-to-br from-slate-700 via-slate-500 to-slate-400"
  },
  morning: {
    background: "linear-gradient(to right bottom, rgb(148, 163, 184), rgb(203, 213, 225), rgb(226, 232, 240))",
    fallbackClass: "bg-gradient-to-br from-slate-400 via-slate-300 to-slate-200"
  },
  midday: {
    background: "linear-gradient(to right bottom, rgb(203, 213, 225), rgb(226, 232, 240), rgb(203, 213, 225))",
    fallbackClass: "bg-gradient-to-br from-slate-300 via-slate-200 to-slate-300"
  },
  afternoon: {
    background: "linear-gradient(to right bottom, rgb(148, 163, 184), rgb(203, 213, 225), rgb(148, 163, 184))",
    fallbackClass: "bg-gradient-to-br from-slate-400 via-slate-300 to-slate-400"
  },
  sunset: {
    background: "linear-gradient(to right bottom, rgb(100, 116, 139), rgb(71, 85, 105), rgb(51, 65, 85))",
    fallbackClass: "bg-gradient-to-br from-slate-500 via-slate-600 to-slate-700"
  },
  night: {
    background: "linear-gradient(to right bottom, rgb(30, 41, 59), rgb(15, 23, 42), rgb(30, 41, 59))",
    fallbackClass: "bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800"
  }
};

// Rainy gradients for different times of day
const rainyGradients = {
  dawn: {
    background: "linear-gradient(to right bottom, rgb(30, 41, 59), rgb(71, 85, 105), rgb(21, 94, 117))",
    fallbackClass: "bg-gradient-to-br from-slate-800 via-slate-600 to-cyan-800"
  },
  morning: {
    background: "linear-gradient(to right bottom, rgb(71, 85, 105), rgb(100, 116, 139), rgb(14, 116, 144))",
    fallbackClass: "bg-gradient-to-br from-slate-600 via-slate-500 to-cyan-700"
  },
  midday: {
    background: "linear-gradient(to right bottom, rgb(100, 116, 139), rgb(148, 163, 184), rgb(8, 145, 178))",
    fallbackClass: "bg-gradient-to-br from-slate-500 via-slate-400 to-cyan-600"
  },
  afternoon: {
    background: "linear-gradient(to right bottom, rgb(71, 85, 105), rgb(100, 116, 139), rgb(14, 116, 144))",
    fallbackClass: "bg-gradient-to-br from-slate-600 via-slate-500 to-cyan-700"
  },
  sunset: {
    background: "linear-gradient(to right bottom, rgb(51, 65, 85), rgb(71, 85, 105), rgb(21, 94, 117))",
    fallbackClass: "bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-800"
  },
  night: {
    background: "linear-gradient(to right bottom, rgb(15, 23, 42), rgb(30, 41, 59), rgb(22, 78, 99))",
    fallbackClass: "bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900"
  }
};

// Storm gradients for different times of day
const stormGradients = {
  dawn: {
    background: "linear-gradient(to right bottom, rgb(15, 23, 42), rgb(30, 41, 59), rgb(55, 65, 81))",
    fallbackClass: "bg-gradient-to-br from-slate-900 via-slate-800 to-gray-700"
  },
  morning: {
    background: "linear-gradient(to right bottom, rgb(30, 41, 59), rgb(51, 65, 85), rgb(75, 85, 99))",
    fallbackClass: "bg-gradient-to-br from-slate-800 via-slate-700 to-gray-600"
  },
  midday: {
    background: "linear-gradient(to right bottom, rgb(51, 65, 85), rgb(71, 85, 105), rgb(107, 114, 128))",
    fallbackClass: "bg-gradient-to-br from-slate-700 via-slate-600 to-gray-500"
  },
  afternoon: {
    background: "linear-gradient(to right bottom, rgb(30, 41, 59), rgb(51, 65, 85), rgb(75, 85, 99))",
    fallbackClass: "bg-gradient-to-br from-slate-800 via-slate-700 to-gray-600"
  },
  sunset: {
    background: "linear-gradient(to right bottom, rgb(15, 23, 42), rgb(30, 41, 59), rgb(55, 65, 81))",
    fallbackClass: "bg-gradient-to-br from-slate-900 via-slate-800 to-gray-700"
  },
  night: {
    background: "linear-gradient(to right bottom, rgb(2, 6, 23), rgb(15, 23, 42), rgb(31, 41, 55))",
    fallbackClass: "bg-gradient-to-br from-slate-950 via-slate-900 to-gray-800"
  }
};

// Foggy gradients for different times of day
const foggyGradients = {
  dawn: {
    background: "linear-gradient(to right bottom, rgb(107, 114, 128), rgb(156, 163, 175), rgb(209, 213, 219))",
    fallbackClass: "bg-gradient-to-br from-gray-500 via-gray-400 to-gray-300"
  },
  morning: {
    background: "linear-gradient(to right bottom, rgb(156, 163, 175), rgb(209, 213, 219), rgb(229, 231, 235))",
    fallbackClass: "bg-gradient-to-br from-gray-400 via-gray-300 to-gray-200"
  },
  midday: {
    background: "linear-gradient(to right bottom, rgb(209, 213, 219), rgb(229, 231, 235), rgb(243, 244, 246))",
    fallbackClass: "bg-gradient-to-br from-gray-300 via-gray-200 to-gray-100"
  },
  afternoon: {
    background: "linear-gradient(to right bottom, rgb(156, 163, 175), rgb(209, 213, 219), rgb(229, 231, 235))",
    fallbackClass: "bg-gradient-to-br from-gray-400 via-gray-300 to-gray-200"
  },
  sunset: {
    background: "linear-gradient(to right bottom, rgb(107, 114, 128), rgb(156, 163, 175), rgb(209, 213, 219))",
    fallbackClass: "bg-gradient-to-br from-gray-500 via-gray-400 to-gray-300"
  },
  night: {
    background: "linear-gradient(to right bottom, rgb(55, 65, 81), rgb(75, 85, 99), rgb(107, 114, 128))",
    fallbackClass: "bg-gradient-to-br from-gray-700 via-gray-600 to-gray-500"
  }
};

// Snow gradients
const snowGradients = {
  dawn: {
    background: "linear-gradient(to right bottom, rgb(203, 213, 225), rgb(226, 232, 240), rgb(241, 245, 249))",
    fallbackClass: "bg-gradient-to-br from-slate-300 via-slate-200 to-slate-100"
  },
  morning: {
    background: "linear-gradient(to right bottom, rgb(226, 232, 240), rgb(241, 245, 249), rgb(248, 250, 252))",
    fallbackClass: "bg-gradient-to-br from-slate-200 via-slate-100 to-slate-50"
  },
  midday: {
    background: "linear-gradient(to right bottom, rgb(224, 242, 254), rgb(240, 249, 255), rgb(248, 250, 252))",
    fallbackClass: "bg-gradient-to-br from-blue-100 via-blue-50 to-slate-50"
  },
  afternoon: {
    background: "linear-gradient(to right bottom, rgb(219, 234, 254), rgb(239, 246, 255), rgb(241, 245, 249))",
    fallbackClass: "bg-gradient-to-br from-blue-100 via-blue-50 to-slate-100"
  },
  sunset: {
    background: "linear-gradient(to right bottom, rgb(186, 230, 253), rgb(224, 242, 254), rgb(226, 232, 240))",
    fallbackClass: "bg-gradient-to-br from-sky-200 via-sky-100 to-slate-200"
  },
  night: {
    background: "linear-gradient(to right bottom, rgb(148, 163, 184), rgb(203, 213, 225), rgb(226, 232, 240))",
    fallbackClass: "bg-gradient-to-br from-slate-400 via-slate-300 to-slate-200"
  }
};

/**
 * Determine which time phase we're in
 * @param hour - Current hour (24-hour format)
 * @returns Time phase string
 */
const getTimePhase = (hour: number): TimePhase => {
  if (hour >= DAWN_START && hour < DAWN_END) return 'dawn';
  if (hour >= MORNING_START && hour < MORNING_END) return 'morning';
  if (hour >= MIDDAY_START && hour < MIDDAY_END) return 'midday';
  if (hour >= AFTERNOON_START && hour < AFTERNOON_END) return 'afternoon';
  if (hour >= SUNSET_START && hour < SUNSET_END) return 'sunset';
  return 'night';
};

/**
 * Get the appropriate gradient based on weather conditions and time
 * 
 * @param timeOfDay - Original time period ('morning', 'day', 'night')
 * @param weatherCondition - Weather condition (e.g., 'clear', 'cloudy', 'rain')
 * @returns The appropriate gradient styles with fallback classes
 */
export const getWeatherGradientStyles = (
  timeOfDay: TimePeriod = 'day',
  weatherCondition: string = 'clear'
) => {
  // Normalize condition for consistency
  const condition = weatherCondition?.toLowerCase() || 'clear';
  
  // Get current hour to determine the time phase
  const now = new Date();
  const hour = now.getHours();
  const phase = getTimePhase(hour);
  
  // Select the appropriate gradient set based on weather condition
  let gradientSet;
  if (condition.includes('clear') || condition.includes('sunny')) {
    gradientSet = clearGradients;
  } else if (condition.includes('cloud') || condition.includes('overcast') || condition.includes('partly')) {
    gradientSet = cloudyGradients;
  } else if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('shower')) {
    gradientSet = rainyGradients;
  } else if (condition.includes('thunder') || condition.includes('storm') || condition.includes('lightning')) {
    gradientSet = stormGradients;
  } else if (condition.includes('fog') || condition.includes('mist') || condition.includes('haze')) {
    gradientSet = foggyGradients;
  } else if (condition.includes('snow') || condition.includes('sleet') || condition.includes('ice')) {
    gradientSet = snowGradients;
  } else {
    // Default to clear weather gradients
    gradientSet = clearGradients;
  }
  
  // Return the gradient for the current time phase
  return {
    gradientStyle: { background: gradientSet[phase].background },
    fallbackGradientClass: gradientSet[phase].fallbackClass
  };
};
