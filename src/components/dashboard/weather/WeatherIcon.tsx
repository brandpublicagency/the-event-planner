
import React from 'react';
import { Cloud, CloudRain, CloudSnow, CloudLightning, Sun, CloudFog, Moon, Sunrise, Sunset, Wind } from 'lucide-react';
import { motion } from 'framer-motion';

interface WeatherIconProps {
  weatherData?: any;
  currentHour: number;
  chanceOfRain: string;
  className?: string;
  weatherType?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ 
  weatherData, 
  currentHour, 
  chanceOfRain,
  className = "",
  weatherType 
}) => {
  // Motion variants for different weather icons
  const sunVariants = {
    hover: { 
      rotate: 180,
      scale: 1.1,
      transition: { duration: 1.5 }
    }
  };
  
  const cloudVariants = {
    hover: { 
      x: [0, 5, 0, -5, 0],
      transition: { duration: 2, repeat: Infinity }
    }
  };
  
  const rainVariants = {
    hover: { 
      y: [0, 3, 0],
      transition: { duration: 1, repeat: Infinity }
    }
  };

  const windVariants = {
    hover: {
      x: [0, 3, 0, -3, 0],
      rotateZ: [0, 5, 0, -5, 0],
      transition: { duration: 1.5, repeat: Infinity }
    }
  };

  const fogVariants = {
    hover: {
      opacity: [0.7, 1, 0.7],
      y: [0, -2, 0],
      transition: { duration: 2, repeat: Infinity }
    }
  };

  const lightningVariants = {
    hover: {
      scale: [1, 1.2, 1],
      filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"],
      transition: { duration: 0.7, repeat: Infinity, repeatType: "mirror" }
    }
  };
  
  // Get icon with animation based on weather conditions
  const getAnimatedIcon = (Icon: any, variants: any) => {
    return (
      <motion.div
        whileHover="hover"
        variants={variants}
        initial="initial"
        animate="hover"
        className={`h-5 w-5 ${className}`}
      >
        <Icon className="h-full w-full" />
      </motion.div>
    );
  };
  
  // First check explicit weatherType if provided
  if (weatherType) {
    const type = weatherType.toLowerCase();
    if (type.includes('thunder') || type.includes('lightning')) {
      return getAnimatedIcon(CloudLightning, lightningVariants);
    } else if (type.includes('rain') || type.includes('shower') || type.includes('drizzle')) {
      return getAnimatedIcon(CloudRain, rainVariants);
    } else if (type.includes('snow')) {
      return getAnimatedIcon(CloudSnow, rainVariants);
    } else if (type.includes('fog') || type.includes('mist') || type.includes('haze')) {
      return getAnimatedIcon(CloudFog, fogVariants);
    } else if (type.includes('wind')) {
      return getAnimatedIcon(Wind, windVariants);
    } else if (type.includes('cloud') || type.includes('overcast')) {
      return getAnimatedIcon(Cloud, cloudVariants);
    } else if (type.includes('sun')) {
      return getAnimatedIcon(Sun, sunVariants);
    }
  }
  
  // Then check if we have weather data with description
  if (weatherData?.description) {
    const desc = weatherData.description.toLowerCase();
    if (desc.includes('thunder') || desc.includes('lightning')) {
      return getAnimatedIcon(CloudLightning, lightningVariants);
    } else if (desc.includes('rain') || desc.includes('shower') || desc.includes('drizzle')) {
      return getAnimatedIcon(CloudRain, rainVariants);
    } else if (desc.includes('snow')) {
      return getAnimatedIcon(CloudSnow, rainVariants);
    } else if (desc.includes('fog') || desc.includes('mist') || desc.includes('haze')) {
      return getAnimatedIcon(CloudFog, fogVariants);
    } else if (desc.includes('wind')) {
      return getAnimatedIcon(Wind, windVariants);
    } else if (desc.includes('cloud') || desc.includes('overcast')) {
      return getAnimatedIcon(Cloud, cloudVariants);
    }
  }
  
  // Fallback to time-based icons
  // Nighttime (7 PM - 5 AM)
  if (currentHour >= 19 || currentHour < 5) {
    return getAnimatedIcon(Moon, {
      hover: { rotate: 20, scale: 1.1, transition: { duration: 2 } }
    });
  }
  // Early morning or late afternoon
  else if ((currentHour >= 5 && currentHour < 8) || (currentHour >= 16 && currentHour < 19)) {
    return chanceOfRain === "HIGH" 
      ? getAnimatedIcon(Cloud, cloudVariants)
      : (currentHour < 12 
          ? getAnimatedIcon(Sunrise, {
              hover: { y: [-3, 0, -3], transition: { duration: 2, repeat: Infinity } }
            })
          : getAnimatedIcon(Sunset, {
              hover: { y: [0, 3, 0], transition: { duration: 2, repeat: Infinity } }
            })
        );
  }
  // Daytime
  else {
    return chanceOfRain === "HIGH" 
      ? getAnimatedIcon(Cloud, cloudVariants)
      : getAnimatedIcon(Sun, sunVariants);
  }
};
