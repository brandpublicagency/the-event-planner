
import React from 'react';

interface WeatherIconProps {
  condition?: string;
  className?: string;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ condition, className = "" }) => {
  switch(condition?.toLowerCase()) {
    case 'sunny':
    case 'clear':
    case 'clear skies':
      return (
        <div className={className}>
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="25" fill="#FFD700" />
            <path d="M50 15V5M50 95V85M85 50H95M5 50H15M76 24L83 17M17 83L24 76M24 24L17 17M83 83L76 76" stroke="#FFD700" strokeWidth="6" strokeLinecap="round" />
          </svg>
        </div>
      );
    case 'partly-cloudy':
    case 'partly cloudy':
    case 'mostly sunny':
      return (
        <div className={className}>
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="35" cy="35" r="20" fill="#FFD700" />
            <path d="M70 75C81.046 75 90 66.0457 90 55C90 43.9543 81.046 35 70 35C70 24.6112 61.8112 16 51.5 16C41.1888 16 33 24.6112 33 35C21.9543 35 13 43.9543 13 55C13 66.0457 21.9543 75 33 75H70Z" fill="white" />
          </svg>
        </div>
      );
    case 'cloudy':
    case 'clouds':
    case 'overcast':
    case 'mostly cloudy':
      return (
        <div className={className}>
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M80 65C91.046 65 100 56.0457 100 45C100 33.9543 91.046 25 80 25C80 14.6112 71.8112 6 61.5 6C51.1888 6 43 14.6112 43 25C31.9543 25 23 33.9543 23 45C23 56.0457 31.9543 65 43 65H80Z" fill="#E0E0E0" />
            <path d="M60 85C71.046 85 80 76.0457 80 65C80 53.9543 71.046 45 60 45C60 34.6112 51.8112 26 41.5 26C31.1888 26 23 34.6112 23 45C11.9543 45 3 53.9543 3 65C3 76.0457 11.9543 85 23 85H60Z" fill="white" />
          </svg>
        </div>
      );
    case 'rain':
    case 'rainy':
    case 'drizzle':
    case 'light rain':
      return (
        <div className={className}>
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M70 40C81.046 40 90 31.0457 90 20C90 8.95431 81.046 0 70 0C70 0 61.8112 0 51.5 0C41.1888 0 33 8.95431 33 20C21.9543 20 13 28.9543 13 40C13 51.0457 21.9543 60 33 60H70V40Z" fill="#E0E0E0" />
            <path d="M33 40L23 60M43 40L33 60M53 40L43 60M63 40L53 60M73 40L63 60" stroke="#4DA6FF" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
      );
    case 'thunderstorm':
    case 'thunder':
    case 'lightning':
      return (
        <div className={className}>
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M70 40C81.046 40 90 31.0457 90 20C90 8.95431 81.046 0 70 0C70 0 61.8112 0 51.5 0C41.1888 0 33 8.95431 33 20C21.9543 20 13 28.9543 13 40C13 51.0457 21.9543 60 33 60H70V40Z" fill="#E0E0E0" />
            <path d="M50 45L40 60H50L45 75L65 55H52L60 45H50Z" fill="#FFD700" stroke="#FF8C00" strokeWidth="2" />
            <path d="M33 30L23 50M53 30L43 50" stroke="#4DA6FF" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
      );
    case 'windy':
    case 'wind':
      return (
        <div className={className}>
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M70 60C81.046 60 90 51.0457 90 40C90 28.9543 81.046 20 70 20C70 20 61.8112 20 51.5 20C41.1888 20 33 28.9543 33 40C21.9543 40 13 48.9543 13 60C13 71.0457 21.9543 80 33 80H70V60Z" fill="white" />
            <path d="M20 35H65C65 35 75 35 75 25C75 15 65 15 60 15C55 15 52.5 20 55 25" stroke="#A0A0A0" strokeWidth="3" strokeLinecap="round" />
            <path d="M15 45H75C75 45 85 45 85 35C85 25 75 25 70 25" stroke="#A0A0A0" strokeWidth="3" strokeLinecap="round" />
            <path d="M30 55H60C60 55 70 55 70 65C70 75 60 75 55 75" stroke="#A0A0A0" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      );
    default:
      return (
        <div className={className}>
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M70 75C81.046 75 90 66.0457 90 55C90 43.9543 81.046 35 70 35C70 24.6112 61.8112 16 51.5 16C41.1888 16 33 24.6112 33 35C21.9543 35 13 43.9543 13 55C13 66.0457 21.9543 75 33 75H70Z" fill="white" />
          </svg>
        </div>
      );
  }
};

export default WeatherIcon;
