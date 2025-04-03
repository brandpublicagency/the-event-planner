
import { TimePhase } from '../utils/timeUtils';

type GradientStyle = {
  background: string;
  fallbackClass: string;
};

type GradientSet = Record<TimePhase, GradientStyle>;

// Muted, darker cloudy gradients for different times of day
export const cloudyGradients: GradientSet = {
  dawn: {
    background: "linear-gradient(to right bottom, rgb(36, 42, 59), rgb(48, 54, 74), rgb(42, 57, 72))",
    fallbackClass: "bg-gradient-to-br from-slate-800 via-slate-700 to-slate-700"
  },
  morning: {
    background: "linear-gradient(to right bottom, rgb(51, 57, 75), rgb(63, 69, 89), rgb(57, 72, 87))",
    fallbackClass: "bg-gradient-to-br from-slate-700 via-slate-600 to-slate-600"
  },
  midday: {
    background: "linear-gradient(to right bottom, rgb(71, 77, 95), rgb(83, 89, 109), rgb(77, 92, 107))",
    fallbackClass: "bg-gradient-to-br from-slate-600 via-slate-500 to-slate-500"
  },
  afternoon: {
    background: "linear-gradient(to right bottom, rgb(56, 62, 80), rgb(68, 74, 94), rgb(62, 77, 92))",
    fallbackClass: "bg-gradient-to-br from-slate-700 via-slate-600 to-slate-600"
  },
  sunset: {
    background: "linear-gradient(to right bottom, rgb(41, 47, 65), rgb(53, 59, 79), rgb(47, 62, 77))",
    fallbackClass: "bg-gradient-to-br from-slate-800 via-slate-700 to-slate-700"
  },
  night: {
    background: "linear-gradient(to right bottom, rgb(26, 31, 44), rgb(33, 38, 53), rgb(28, 36, 48))",
    fallbackClass: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-800"
  }
};
