
import { TimePhase } from '../utils/timeUtils';

type GradientStyle = {
  background: string;
  fallbackClass: string;
};

type GradientSet = Record<TimePhase, GradientStyle>;

// Muted clear sky gradients for different times of day
export const clearGradients: GradientSet = {
  dawn: {
    background: "linear-gradient(to right bottom, rgb(36, 42, 59), rgb(48, 54, 74), rgb(57, 63, 83))",
    fallbackClass: "bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600"
  },
  morning: {
    background: "linear-gradient(to right bottom, rgb(51, 57, 75), rgb(63, 69, 89), rgb(72, 78, 98))",
    fallbackClass: "bg-gradient-to-br from-slate-700 via-slate-600 to-slate-500"
  },
  midday: {
    background: "linear-gradient(to right bottom, rgb(66, 72, 90), rgb(78, 84, 104), rgb(87, 93, 113))",
    fallbackClass: "bg-gradient-to-br from-slate-600 via-slate-500 to-slate-400"
  },
  afternoon: {
    background: "linear-gradient(to right bottom, rgb(56, 62, 80), rgb(68, 74, 94), rgb(77, 83, 103))",
    fallbackClass: "bg-gradient-to-br from-slate-700 via-slate-600 to-slate-500"
  },
  sunset: {
    background: "linear-gradient(to right bottom, rgb(46, 52, 70), rgb(58, 64, 84), rgb(67, 73, 93))",
    fallbackClass: "bg-gradient-to-br from-slate-700 via-slate-600 to-slate-500"
  },
  night: {
    background: "linear-gradient(to right bottom, rgb(26, 31, 44), rgb(33, 38, 53), rgb(38, 43, 58))",
    fallbackClass: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700"
  }
};
