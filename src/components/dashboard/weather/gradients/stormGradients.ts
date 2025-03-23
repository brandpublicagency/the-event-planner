
import { TimePhase } from '../utils/timeUtils';

type GradientStyle = {
  background: string;
  fallbackClass: string;
};

type GradientSet = Record<TimePhase, GradientStyle>;

// Storm gradients for different times of day
export const stormGradients: GradientSet = {
  dawn: {
    background: "linear-gradient(to right bottom, rgb(15, 23, 42), rgb(30, 41, 59), rgb(55, 65, 81))",
    fallbackClass: "bg-gradient-to-br from-slate-900 via-slate-800 to-gray-700"
  },
  morning: {
    background: "linear-gradient(to right bottom, rgb(30, 41, 59), rgb(51, 65, 85), rgb(75, 85, 99))",
    fallbackClass: "bg-gradient-to-br from-slate-800 via-slate-700 to-gray-600"
  },
  midday: {
    background: "linear-gradient(to right bottom, rgb(51, 65, 85), rgb(71, 85, 105), rgb(107, 114, 128))",
    fallbackClass: "bg-gradient-to-br from-slate-700 via-slate-600 to-gray-500"
  },
  afternoon: {
    background: "linear-gradient(to right bottom, rgb(30, 41, 59), rgb(51, 65, 85), rgb(75, 85, 99))",
    fallbackClass: "bg-gradient-to-br from-slate-800 via-slate-700 to-gray-600"
  },
  sunset: {
    background: "linear-gradient(to right bottom, rgb(15, 23, 42), rgb(30, 41, 59), rgb(55, 65, 81))",
    fallbackClass: "bg-gradient-to-br from-slate-900 via-slate-800 to-gray-700"
  },
  night: {
    background: "linear-gradient(to right bottom, rgb(2, 6, 23), rgb(15, 23, 42), rgb(31, 41, 55))",
    fallbackClass: "bg-gradient-to-br from-slate-950 via-slate-900 to-gray-800"
  }
};
