import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import ChatMessage from "./chat/ChatMessage";
import ChatInput from "./chat/ChatInput";
import { useChatContext } from "@/hooks/useChatContext";
import { getChatCompletion } from "@/services/openai";
import { sendEmail } from "@/services/email";
import { updateMenuSelection } from "@/services/menuService";
import { updateEvent, createEvent, deleteEvent } from "@/services/eventService";
import { createTask, updateTask, deleteTask } from "@/services/taskService";
import { prepareEventsContext, getSystemMessage } from "@/utils/chatContextUtils";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

const TIMEOUT_DURATION = 45000;

const ChatBox = () => {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<any>(null);
  const { toast } = useToast();
  const { data: contextData, isLoading: isContextLoading } = useChatContext();

  const handleConfirmation = async (confirmed: boolean) => {
    if (!confirmed || !pendingAction) {
      setMessages(prev => [...prev, { 
        text: "Action cancelled.", 
        isUser: false 
      }]);
      setPendingAction(null);
      return;
    }

    try {
      switch (pendingAction.action) {
        case "update_event":
          await updateEvent(pendingAction.event_code, pendingAction.updates);
          setMessages(prev => [...prev, { 
            text: `Event ${pendingAction.event_code} has been updated successfully!`, 
            isUser: false 
          }]);
          break;
        // Add other action types here as needed
      }
      toast({
        title: "Success",
        description: "Action completed successfully",
      });
    } catch (error) {
      console.error('Error executing action:', error);
      toast({
        title: "Error",
        description: "Failed to execute the requested action",
        variant: "destructive",
      });
      setMessages(prev => [...prev, { 
        text: "Sorry, I encountered an error while executing the action.", 
        isUser: false 
      }]);
    }
    setPendingAction(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    if (pendingAction) {
      const isConfirmation = inputValue.toLowerCase().includes('yes') || 
                            inputValue.toLowerCase().includes('confirm') ||
                            inputValue.toLowerCase() === 'y';
      const isDenial = inputValue.toLowerCase().includes('no') || 
                      inputValue.toLowerCase().includes('cancel') ||
                      inputValue.toLowerCase() === 'n';

      if (isConfirmation || isDenial) {
        setMessages(prev => [...prev, { text: inputValue, isUser: true }]);
        setInputValue("");
        await handleConfirmation(isConfirmation);
        return;
      }
    }

    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      toast({
        title: "Error",
        description: "OpenAI API key not configured",
        variant: "destructive",
      });
      return;
    }

    const newMessages = [...messages, { text: inputValue, isUser: true }];
    setMessages(newMessages);
    setInputValue("");
    setIsLoading(true);

    let timeoutId: NodeJS.Timeout;
    const timeoutPromise = new Promise<string>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error("Request timed out. Please try a shorter message or try again later."));
      }, TIMEOUT_DURATION);
    });

    try {
      const eventsContext = prepareEventsContext(contextData?.events);
      const pdfContext = contextData?.pdfContent?.map(pdf => 
        `Document Content: ${pdf.content}`
      ).join('\n\n');

      const systemMessage = getSystemMessage(eventsContext, pdfContext);
      const userMessages: ChatCompletionMessageParam[] = newMessages.map(msg => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.text,
        name: undefined
      }));

      const response = await Promise.race<string>([
        getChatCompletion([systemMessage, ...userMessages]),
        timeoutPromise
      ]);

      clearTimeout(timeoutId);

      if (!response) {
        throw new Error("No response received from AI");
      }

      try {
        const jsonResponse = JSON.parse(response);
        
        if (jsonResponse.action === "update_event") {
          setPendingAction(jsonResponse);
          setMessages([...newMessages, { 
            text: `I'll help you update the event (${jsonResponse.event_code}). Please confirm this action by replying with 'yes' or 'no'.`, 
            isUser: false 
          }]);
        } else if (jsonResponse.action === "update_menu") {
          await updateMenuSelection(jsonResponse.event_code, jsonResponse.menu_updates);
          setMessages([...newMessages, { text: "Menu updated successfully!", isUser: false }]);
        } else if (jsonResponse.action === "send_email") {
          await sendEmail(jsonResponse.to, jsonResponse.subject, jsonResponse.content);
          setMessages([...newMessages, { text: "Email sent successfully!", isUser: false }]);
        } else if (jsonResponse.action === "create_event") {
          await createEvent(jsonResponse.event_data);
          setMessages([...newMessages, { text: "Event created successfully!", isUser: false }]);
        } else if (jsonResponse.action === "delete_event") {
          await deleteEvent(jsonResponse.event_code);
          setMessages([...newMessages, { text: "Event deleted successfully!", isUser: false }]);
        } else if (jsonResponse.action === "create_task") {
          await createTask(jsonResponse.task_data);
          setMessages([...newMessages, { text: "Task created successfully!", isUser: false }]);
        } else if (jsonResponse.action === "update_task") {
          await updateTask(jsonResponse.task_id, jsonResponse.updates);
          setMessages([...newMessages, { text: "Task updated successfully!", isUser: false }]);
        } else if (jsonResponse.action === "delete_task") {
          await deleteTask(jsonResponse.task_id);
          setMessages([...newMessages, { text: "Task deleted successfully!", isUser: false }]);
        } else {
          setMessages([...newMessages, { text: String(response), isUser: false }]);
        }
      } catch {
        setMessages([...newMessages, { text: String(response), isUser: false }]);
      }
    } catch (error: any) {
      console.error('Error in chat completion:', error);
      
      const errorMessage = error.message === "Request timed out. Please try a shorter message or try again later."
        ? error.message
        : "I apologize, but I encountered an error. Please try again with a shorter message.";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });

      setMessages([...newMessages, { 
        text: errorMessage, 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-[450px]">
      <div 
        className="absolute inset-0 rounded-3xl"
        style={{
          background: "linear-gradient(to right, #ec4899, #8b5cf6, #3b82f6)",
          padding: "1px",
        }}
      >
        <Card className="h-full w-full flex flex-col bg-background rounded-3xl">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <ChatMessage key={index} {...message} />
              ))}
            </div>
          </ScrollArea>
          <ChatInput
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onSubmit={handleSubmit}
            isLoading={isLoading || isContextLoading}
          />
        </Card>
      </div>
    </div>
  );
};

export default ChatBox;