import { useEffect, useState } from "react";
import OpenAI from "openai";
import { Skeleton } from "@/components/ui/skeleton";

const openai = import.meta.env.VITE_OPENAI_API_KEY 
  ? new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    })
  : null;

const AIGreeting = () => {
  const [greeting, setGreeting] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateGreeting = async () => {
      if (!openai) {
        setGreeting("Welcome to the Event Management System!");
        setLoading(false);
        return;
      }

      try {
        const completion = await openai.chat.completions.create({
          messages: [
            {
              role: "system",
              content: "You are a friendly event planning assistant. Generate a warm, personalized greeting for users of an event planning system. Keep it under 100 characters."
            }
          ],
          model: "gpt-4o-mini",
        });

        const generatedGreeting = completion.choices[0]?.message?.content;
        if (generatedGreeting) {
          setGreeting(generatedGreeting);
        } else {
          setGreeting("Welcome to the Event Management System!");
        }
      } catch (error) {
        console.error('Error generating greeting:', error);
        setGreeting("Welcome to the Event Management System!");
      } finally {
        setLoading(false);
      }
    };

    generateGreeting();
  }, []);

  if (loading) {
    return <Skeleton className="h-8 w-[300px]" />;
  }

  return <h1 className="text-2xl font-semibold text-gray-900">{greeting}</h1>;
};

export default AIGreeting;