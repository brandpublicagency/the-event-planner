
import React from 'react';

interface MentionEmptyStateProps {
  error: string | null;
}

export const MentionEmptyState: React.FC<MentionEmptyStateProps> = ({ error }) => {
  if (error) {
    return (
      <div className="text-xs text-red-500 bg-white bg-opacity-90 px-2 py-1 rounded-md shadow-sm border border-gray-200">
        {error}
      </div>
    );
  }
  
  return (
    <div className="text-xs text-gray-500 bg-white bg-opacity-90 px-2 py-1 rounded-md shadow-sm border border-gray-200">
      No results found
    </div>
  );
};
