
import { TimePhase } from '../utils/timeUtils';

type GradientStyle = {
  background: string;
  fallbackClass: string;
};

type GradientSet = Record<TimePhase, GradientStyle>;

// Rainy gradients for different times of day
export const rainyGradients: GradientSet = {
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
