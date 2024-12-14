interface ChatMessageProps {
  text: string;
  isUser: boolean;
}

const ChatMessage = ({ text, isUser }: ChatMessageProps) => {
  console.log('Rendering ChatMessage:', { text, isUser });
  
  return (
    <div 
      className={`flex ${isUser ? "justify-end" : "justify-start"} animate-in fade-in duration-300`}
    >
      <div
        style={{ borderRadius: "14px" }}
        className={`px-4 py-2 max-w-[80%] border ${
          isUser
            ? "border-purple-500 text-purple-800 bg-white"
            : "border-gray-300 text-gray-800 bg-white"
        }`}
      >
        {text}
      </div>
    </div>
  );
};

export default ChatMessage;