
export const formatDate = (dateString: string): string => {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';
  
  // Format as DD MMM YYYY
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export const formatTimeRange = (startTime?: string, endTime?: string): string => {
  if (!startTime) return '';
  
  const formattedStartTime = startTime.substring(0, 5);
  const formattedEndTime = endTime ? endTime.substring(0, 5) : '';
  
  return formattedEndTime ? `${formattedStartTime} - ${formattedEndTime}` : formattedStartTime;
};
