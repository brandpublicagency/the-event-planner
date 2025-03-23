
import { TimePhase } from '../utils/timeUtils';

type GradientStyle = {
  background: string;
  fallbackClass: string;
};

type GradientSet = Record<TimePhase, GradientStyle>;

// Snow gradients for different times of day
export const snowGradients: GradientSet = {
  dawn: {
    background: "linear-gradient(to right bottom, rgb(203, 213, 225), rgb(226, 232, 240), rgb(241, 245, 249))",
    fallbackClass: "bg-gradient-to-br from-slate-300 via-slate-200 to-slate-100"
  },
  morning: {
    background: "linear-gradient(to right bottom, rgb(226, 232, 240), rgb(241, 245, 249), rgb(248, 250, 252))",
    fallbackClass: "bg-gradient-to-br from-slate-200 via-slate-100 to-slate-50"
  },
  midday: {
    background: "linear-gradient(to right bottom, rgb(224, 242, 254), rgb(240, 249, 255), rgb(248, 250, 252))",
    fallbackClass: "bg-gradient-to-br from-blue-100 via-blue-50 to-slate-50"
  },
  afternoon: {
    background: "linear-gradient(to right bottom, rgb(219, 234, 254), rgb(239, 246, 255), rgb(241, 245, 249))",
    fallbackClass: "bg-gradient-to-br from-blue-100 via-blue-50 to-slate-100"
  },
  sunset: {
    background: "linear-gradient(to right bottom, rgb(186, 230, 253), rgb(224, 242, 254), rgb(226, 232, 240))",
    fallbackClass: "bg-gradient-to-br from-sky-200 via-sky-100 to-slate-200"
  },
  night: {
    background: "linear-gradient(to right bottom, rgb(148, 163, 184), rgb(203, 213, 225), rgb(226, 232, 240))",
    fallbackClass: "bg-gradient-to-br from-slate-400 via-slate-300 to-slate-200"
  }
};
