
export const handleError = (error: any, context: string) => {
  console.error(`Error in ${context}:`, {
    message: error.message,
    stack: error.stack,
    details: error
  });
  
  return {
    type: 'text',
    message: "I encountered an error processing your request. Please try again or type 'help' for available commands."
  };
};
