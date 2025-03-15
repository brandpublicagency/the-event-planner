
import { useState } from "react";

export const useChatSuggestions = () => {
  // Generate personalized placeholder suggestions
  const suggestions = [
    "What events do I have scheduled this month?",
    "Create a new task for my next event",
    "Show me the guest list for EVENT-001",
    "Update the venue for my next event to The Gallery",
    "What's my next deadline?",
    "Show me all tasks for the Thompson wedding"
  ];

  const [inputValue, setInputValueState] = useState("");
  
  // Handler for clicking on a suggestion
  const handleSuggestionClick = (suggestion: string) => {
    setInputValueState(suggestion);
    // Focus the input field
    const inputElement = document.querySelector('input[placeholder="Type your message..."]') as HTMLInputElement;
    if (inputElement) {
      inputElement.focus();
    }
  };

  return {
    suggestions,
    inputValue,
    setInputValue: setInputValueState,
    handleSuggestionClick
  };
};
