
export const useCopyEventCode = () => {
  const copyEventCode = (eventCode: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(eventCode).then(() => {
      console.log(`Event code ${eventCode} copied to clipboard`);
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  };
  
  return copyEventCode;
};
