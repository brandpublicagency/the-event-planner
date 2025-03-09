
// This file now re-exports functionality from the event subdirectory
// to maintain backward compatibility
import {
  getEventDetails,
  getUpcomingEventsList,
  getCalendarView,
  getNextEvent,
  fetchEventById
} from './event/index.ts';

export {
  getEventDetails,
  getUpcomingEventsList,
  getCalendarView,
  getNextEvent,
  fetchEventById
};
