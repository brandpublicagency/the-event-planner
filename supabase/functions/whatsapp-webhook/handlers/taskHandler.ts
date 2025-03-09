
// This file now re-exports functionality from the task subdirectory
// to maintain backward compatibility
import {
  getTaskDetails,
  getNextTask,
  getTodoList,
  fetchTaskById
} from './task/index.ts';

export {
  getTaskDetails,
  getNextTask,
  getTodoList,
  fetchTaskById
};
