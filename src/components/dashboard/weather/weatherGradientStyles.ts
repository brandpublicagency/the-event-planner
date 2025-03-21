
// Define the structure of gradients for weather/time combinations
export interface GradientStyles {
  background: string;
}

// Export the function that gets the appropriate gradient for the time/weather
export function getWeatherGradientStyles(
  timeOrHour: string | number,
  weatherType?: string
): { gradientStyle: GradientStyles; fallbackGradientClass: string } {
  // Convert hour number to time of day string if needed
  let timeOfDay: string;
  if (typeof timeOrHour === 'number') {
    if (timeOrHour >= 5 && timeOrHour < 12) timeOfDay = 'morning';
    else if (timeOrHour >= 12 && timeOrHour < 18) timeOfDay = 'day';
    else timeOfDay = 'night';
  } else {
    timeOfDay = timeOrHour;
  }

  // Determine weather condition group
  let condition = 'clear';
  if (weatherType) {
    if (weatherType.includes('cloud') || weatherType.includes('overcast')) {
      condition = 'cloudy';
    } else if (weatherType.includes('rain') || weatherType.includes('drizzle') || weatherType.includes('shower')) {
      condition = 'rainy';
    } else if (weatherType.includes('snow')) {
      condition = 'snowy';
    } else if (weatherType.includes('thunder') || weatherType.includes('storm')) {
      condition = 'stormy';
    } else if (weatherType.includes('fog') || weatherType.includes('mist') || weatherType.includes('haze')) {
      condition = 'foggy';
    }
  }

  // Create gradient combinations based on time of day and weather
  const gradients = {
    morning: {
      clear: {
        background: 'linear-gradient(135deg, #FF9966 0%, #FF5E62 100%)',
        fallbackClass: 'bg-orange-500'
      },
      cloudy: {
        background: 'linear-gradient(135deg, #8e9eab 0%, #eef2f3 100%)',
        fallbackClass: 'bg-gray-400'
      },
      rainy: {
        background: 'linear-gradient(135deg, #3a7bd5 0%, #3a6073 100%)',
        fallbackClass: 'bg-blue-700'
      },
      snowy: {
        background: 'linear-gradient(135deg, #E0EAFC 0%, #CFDEF3 100%)',
        fallbackClass: 'bg-blue-100'
      },
      stormy: {
        background: 'linear-gradient(135deg, #373B44 0%, #4286f4 100%)',
        fallbackClass: 'bg-slate-700'
      },
      foggy: {
        background: 'linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)',
        fallbackClass: 'bg-slate-500'
      }
    },
    day: {
      clear: {
        background: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
        fallbackClass: 'bg-blue-500'
      },
      cloudy: {
        background: 'linear-gradient(135deg, #757F9A 0%, #D7DDE8 100%)',
        fallbackClass: 'bg-slate-400'
      },
      rainy: {
        background: 'linear-gradient(135deg, #4DA0B0 0%, #D39D38 100%)',
        fallbackClass: 'bg-teal-600'
      },
      snowy: {
        background: 'linear-gradient(135deg, #E0EAFC 0%, #CFDEF3 100%)',
        fallbackClass: 'bg-blue-100'
      },
      stormy: {
        background: 'linear-gradient(135deg, #283E51 0%, #4B79A1 100%)',
        fallbackClass: 'bg-slate-800'
      },
      foggy: {
        background: 'linear-gradient(135deg, #8e9eab 0%, #eef2f3 100%)',
        fallbackClass: 'bg-slate-400'
      }
    },
    night: {
      clear: {
        background: 'linear-gradient(135deg, #141e30 0%, #243b55 100%)',
        fallbackClass: 'bg-slate-900'
      },
      cloudy: {
        background: 'linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)',
        fallbackClass: 'bg-slate-700'
      },
      rainy: {
        background: 'linear-gradient(135deg, #000046 0%, #1CB5E0 100%)',
        fallbackClass: 'bg-blue-900'
      },
      snowy: {
        background: 'linear-gradient(135deg, #334d50, #cbcaa5)',
        fallbackClass: 'bg-slate-600'
      },
      stormy: {
        background: 'linear-gradient(135deg, #16222A 0%, #3A6073 100%)',
        fallbackClass: 'bg-slate-800'
      },
      foggy: {
        background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
        fallbackClass: 'bg-slate-800'
      }
    }
  };

  // Get the appropriate gradient or fallback to clear day
  const timeGradients = gradients[timeOfDay as keyof typeof gradients] || gradients.day;
  const weatherGradient = timeGradients[condition as keyof typeof timeGradients] || timeGradients.clear;

  return {
    gradientStyle: { background: weatherGradient.background },
    fallbackGradientClass: weatherGradient.fallbackClass
  };
}
