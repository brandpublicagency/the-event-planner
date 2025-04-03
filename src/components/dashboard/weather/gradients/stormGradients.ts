
import { TimePhase } from '../utils/timeUtils';

type GradientStyle = {
  background: string;
  fallbackClass: string;
};

type GradientSet = Record<TimePhase, GradientStyle>;

// Muted storm gradients for different times of day
export const stormGradients: GradientSet = {
  dawn: {
    background: "linear-gradient(to right bottom, rgb(26, 31, 46), rgb(35, 40, 55), rgb(30, 38, 53))",
    fallbackClass: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-800"
  },
  morning: {
    background: "linear-gradient(to right bottom, rgb(36, 41, 56), rgb(45, 50, 65), rgb(40, 48, 63))",
    fallbackClass: "bg-gradient-to-br from-slate-800 via-slate-700 to-slate-700"
  },
  midday: {
    background: "linear-gradient(to right bottom, rgb(46, 51, 66), rgb(55, 60, 75), rgb(50, 58, 73))",
    fallbackClass: "bg-gradient-to-br from-slate-700 via-slate-600 to-slate-600"
  },
  afternoon: {
    background: "linear-gradient(to right bottom, rgb(41, 46, 61), rgb(50, 55, 70), rgb(45, 53, 68))",
    fallbackClass: "bg-gradient-to-br from-slate-800 via-slate-700 to-slate-700"
  },
  sunset: {
    background: "linear-gradient(to right bottom, rgb(31, 36, 51), rgb(40, 45, 60), rgb(35, 43, 58))",
    fallbackClass: "bg-gradient-to-br from-slate-800 via-slate-700 to-slate-700"
  },
  night: {
    background: "linear-gradient(to right bottom, rgb(18, 22, 32), rgb(22, 27, 37), rgb(20, 25, 35))",
    fallbackClass: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-800"
  }
};
