
import { TimePhase } from '../utils/timeUtils';

type GradientStyle = {
  background: string;
  fallbackClass: string;
};

type GradientSet = Record<TimePhase, GradientStyle>;

// Muted rainy gradients for different times of day
export const rainyGradients: GradientSet = {
  dawn: {
    background: "linear-gradient(to right bottom, rgb(30, 41, 59), rgb(39, 48, 65), rgb(34, 45, 60))",
    fallbackClass: "bg-gradient-to-br from-slate-800 via-slate-700 to-slate-700"
  },
  morning: {
    background: "linear-gradient(to right bottom, rgb(45, 56, 74), rgb(54, 63, 80), rgb(49, 60, 75))",
    fallbackClass: "bg-gradient-to-br from-slate-700 via-slate-600 to-slate-600"
  },
  midday: {
    background: "linear-gradient(to right bottom, rgb(60, 71, 89), rgb(69, 78, 95), rgb(64, 75, 90))",
    fallbackClass: "bg-gradient-to-br from-slate-600 via-slate-500 to-slate-500"
  },
  afternoon: {
    background: "linear-gradient(to right bottom, rgb(50, 61, 79), rgb(59, 68, 85), rgb(54, 65, 80))",
    fallbackClass: "bg-gradient-to-br from-slate-700 via-slate-600 to-slate-600"
  },
  sunset: {
    background: "linear-gradient(to right bottom, rgb(40, 51, 69), rgb(49, 58, 75), rgb(44, 55, 70))",
    fallbackClass: "bg-gradient-to-br from-slate-700 via-slate-600 to-slate-600"
  },
  night: {
    background: "linear-gradient(to right bottom, rgb(22, 28, 41), rgb(26, 33, 46), rgb(24, 30, 42))",
    fallbackClass: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-800"
  }
};
