
// Define time phases (in hours, using 24-hour format)
export const DAWN_START = 5;
export const DAWN_END = 8;
export const MORNING_START = 8;
export const MORNING_END = 11;
export const MIDDAY_START = 11;
export const MIDDAY_END = 14;
export const AFTERNOON_START = 14;
export const AFTERNOON_END = 17;
export const SUNSET_START = 17;
export const SUNSET_END = 20;
// Night is 20:00 - 5:00

// Types
export type TimePeriod = 'morning' | 'day' | 'night';
export type TimePhase = 'dawn' | 'morning' | 'midday' | 'afternoon' | 'sunset' | 'night';

/**
 * Determine which time phase we're in
 * @param hour - Current hour (24-hour format)
 * @returns Time phase string
 */
export const getTimePhase = (hour: number): TimePhase => {
  if (hour >= DAWN_START && hour < DAWN_END) return 'dawn';
  if (hour >= MORNING_START && hour < MORNING_END) return 'morning';
  if (hour >= MIDDAY_START && hour < MIDDAY_END) return 'midday';
  if (hour >= AFTERNOON_START && hour < AFTERNOON_END) return 'afternoon';
  if (hour >= SUNSET_START && hour < SUNSET_END) return 'sunset';
  return 'night';
};
