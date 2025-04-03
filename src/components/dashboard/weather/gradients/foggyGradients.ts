
import { TimePhase } from '../utils/timeUtils';

type GradientStyle = {
  background: string;
  fallbackClass: string;
};

type GradientSet = Record<TimePhase, GradientStyle>;

// Muted foggy gradients for different times of day
export const foggyGradients: GradientSet = {
  dawn: {
    background: "linear-gradient(to right bottom, rgb(40, 46, 60), rgb(48, 54, 68), rgb(45, 51, 65))",
    fallbackClass: "bg-gradient-to-br from-slate-800 via-slate-700 to-slate-700"
  },
  morning: {
    background: "linear-gradient(to right bottom, rgb(55, 61, 75), rgb(63, 69, 83), rgb(60, 66, 80))",
    fallbackClass: "bg-gradient-to-br from-slate-700 via-slate-600 to-slate-600"
  },
  midday: {
    background: "linear-gradient(to right bottom, rgb(70, 76, 90), rgb(78, 84, 98), rgb(75, 81, 95))",
    fallbackClass: "bg-gradient-to-br from-slate-600 via-slate-500 to-slate-500"
  },
  afternoon: {
    background: "linear-gradient(to right bottom, rgb(60, 66, 80), rgb(68, 74, 88), rgb(65, 71, 85))",
    fallbackClass: "bg-gradient-to-br from-slate-700 via-slate-600 to-slate-600"
  },
  sunset: {
    background: "linear-gradient(to right bottom, rgb(50, 56, 70), rgb(58, 64, 78), rgb(55, 61, 75))",
    fallbackClass: "bg-gradient-to-br from-slate-700 via-slate-600 to-slate-600"
  },
  night: {
    background: "linear-gradient(to right bottom, rgb(30, 36, 50), rgb(38, 44, 58), rgb(35, 41, 55))",
    fallbackClass: "bg-gradient-to-br from-slate-800 via-slate-700 to-slate-700"
  }
};
