import { Calendar, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import OpenAI from "openai";

// Only initialize OpenAI if API key is available
const openai = import.meta.env.VITE_OPENAI_API_KEY 
  ? new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    })
  : null;

interface ProjectCardProps {
  title: string;
  description: string;
  progress: number;
  teamSize: number;
  dueDate: string;
  onClick?: () => void;
}

const ProjectCard = ({ title, description, progress, teamSize, dueDate, onClick }: ProjectCardProps) => {
  const [aiDescription, setAiDescription] = useState<string>(description);

  useEffect(() => {
    const generateDescription = async () => {
      // Only attempt to generate if OpenAI client is available
      if (!openai) {
        console.log('OpenAI API key not configured, using default description');
        return;
      }

      try {
        const completion = await openai.chat.completions.create({
          messages: [
            {
              role: "system",
              content: "You are a professional event planner. Generate a brief, engaging one-line description for an event."
            },
            {
              role: "user",
              content: `Generate a brief, engaging description for this event: ${title}. Keep it under 100 characters.`
            }
          ],
          model: "gpt-4o-mini",
        });

        const generatedDescription = completion.choices[0]?.message?.content;
        if (generatedDescription) {
          setAiDescription(generatedDescription);
        }
      } catch (error) {
        console.error('Error generating description:', error);
        setAiDescription(description); // Fallback to original description
      }
    };

    generateDescription();
  }, [title, description]);

  return (
    <Card 
      className="cursor-pointer bg-white transition-all duration-700 hover:bg-gradient-to-r hover:from-white hover:via-zinc-50 hover:to-white" 
      onClick={onClick}
    >
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-500">{aiDescription}</p>
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="mt-2" />
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{teamSize} members</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Due {new Date(dueDate).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;