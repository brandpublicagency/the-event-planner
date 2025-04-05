
import React from 'react';
import { Spinner } from '../../ui/spinner';

export const MentionLoadingState: React.FC = () => {
  return (
    <div className="text-xs flex items-center gap-1.5 bg-white bg-opacity-90 px-2 py-1 rounded-md shadow-sm border border-gray-200">
      <Spinner className="h-3 w-3 text-primary-600" />
      <span>Loading...</span>
    </div>
  );
};
