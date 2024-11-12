import { useEffect, useState } from "react";
import OpenAI from "openai";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

const openai = import.meta.env.VITE_OPENAI_API_KEY 
  ? new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
      timeout: 10000, // 10 second timeout
    })
  : null;

console.log("OpenAI client initialization status:", !!openai);

const AIGreeting = () => {
  const [greeting, setGreeting] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const generateGreeting = async () => {
      if (!openai) {
        console.warn("No OpenAI API key found, using default greeting");
        setGreeting("Welcome to the Event Management System!");
        setLoading(false);
        toast({
          title: "Notice",
          description: "Using default greeting (no API key configured)",
          variant: "default",
        });
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // Abort after 8 seconds

      try {
        console.log("Attempting to generate AI greeting");
        const completion = await openai.chat.completions.create({
          messages: [
            {
              role: "system",
              content: "You are a friendly event planning assistant. Generate a warm, personalized greeting for users of an event planning system. Keep it under 100 characters."
            }
          ],
          model: "gpt-3.5-turbo", // Using a more reliable model
          max_tokens: 50, // Limiting response size
        }, { signal: controller.signal });

        clearTimeout(timeoutId);
        
        const generatedText = completion.choices[0]?.message?.content;
        
        if (generatedText) {
          console.log("Generated greeting:", generatedText);
          setGreeting(generatedText);
          toast({
            title: "AI Greeting Generated",
            description: "Successfully connected to OpenAI API",
            variant: "default"
          });
        } else {
          throw new Error("No greeting generated");
        }
      } catch (error: any) {
        clearTimeout(timeoutId);
        console.error('Error generating greeting:', error);
        setGreeting("Welcome to the Event Management System!");
        
        const errorMessage = error.name === 'AbortError' 
          ? "AI greeting request timed out. Using default message."
          : error.message || "Could not generate AI greeting. Using default message.";
        
        toast({
          title: "Notice",
          description: errorMessage,
          variant: "default",
        });
      } finally {
        setLoading(false);
      }
    };

    generateGreeting();
  }, [toast]);

  if (loading) {
    return <Skeleton className="h-8 w-[300px]" />;
  }

  return <h1 className="text-2xl font-semibold text-gray-900">{greeting}</h1>;
};

export default AIGreeting;