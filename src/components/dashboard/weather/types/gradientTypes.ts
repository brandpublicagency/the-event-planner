
import { TimePhase, TimePeriod } from '../utils/timeUtils';

export type GradientStyle = {
  background: string;
  fallbackClass: string;
};

export type GradientSet = Record<TimePhase, GradientStyle>;

export interface WeatherGradientResult {
  gradientStyle: { background: string };
  fallbackGradientClass: string;
}
