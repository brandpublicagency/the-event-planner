
import { TimePhase } from '../utils/timeUtils';

type GradientStyle = {
  background: string;
  fallbackClass: string;
};

type GradientSet = Record<TimePhase, GradientStyle>;

// Clear sky gradients for different times of day - using more muted blue tones
export const clearGradients: GradientSet = {
  dawn: {
    background: "linear-gradient(to right bottom, rgb(30, 58, 138), rgb(59, 130, 246), rgb(125, 211, 252))",
    fallbackClass: "bg-gradient-to-br from-indigo-800 via-blue-500 to-sky-300"
  },
  morning: {
    background: "linear-gradient(to right bottom, rgb(56, 189, 248), rgb(125, 211, 252), rgb(186, 230, 253))",
    fallbackClass: "bg-gradient-to-br from-sky-400 via-sky-300 to-sky-200"
  },
  midday: {
    background: "linear-gradient(to right bottom, rgb(14, 165, 233), rgb(56, 189, 248), rgb(125, 211, 252))",
    fallbackClass: "bg-gradient-to-br from-sky-500 via-sky-400 to-sky-300"
  },
  afternoon: {
    background: "linear-gradient(to right bottom, rgb(59, 130, 246), rgb(56, 189, 248), rgb(125, 211, 252))",
    fallbackClass: "bg-gradient-to-br from-blue-500 via-sky-400 to-sky-300"
  },
  sunset: {
    background: "linear-gradient(to right bottom, rgb(29, 78, 216), rgb(59, 130, 246), rgb(30, 58, 138))",
    fallbackClass: "bg-gradient-to-br from-blue-700 via-blue-500 to-indigo-800"
  },
  night: {
    background: "linear-gradient(to right bottom, rgb(15, 23, 42), rgb(30, 27, 75), rgb(15, 23, 42))",
    fallbackClass: "bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900"
  }
};
