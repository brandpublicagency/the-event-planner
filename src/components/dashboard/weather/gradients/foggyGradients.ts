
import { TimePhase } from '../utils/timeUtils';

type GradientStyle = {
  background: string;
  fallbackClass: string;
};

type GradientSet = Record<TimePhase, GradientStyle>;

// Foggy gradients for different times of day
export const foggyGradients: GradientSet = {
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
