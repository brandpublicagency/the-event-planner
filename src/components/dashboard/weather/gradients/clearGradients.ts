
import { TimePhase } from '../utils/timeUtils';

type GradientStyle = {
  background: string;
  fallbackClass: string;
};

type GradientSet = Record<TimePhase, GradientStyle>;

// Clear sky gradients for different times of day
export const clearGradients: GradientSet = {
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
