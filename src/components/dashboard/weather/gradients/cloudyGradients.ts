
import { TimePhase } from '../utils/timeUtils';

type GradientStyle = {
  background: string;
  fallbackClass: string;
};

type GradientSet = Record<TimePhase, GradientStyle>;

// Cloudy gradients for different times of day
export const cloudyGradients: GradientSet = {
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
