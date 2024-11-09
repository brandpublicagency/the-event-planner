import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const NewProject = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Success",
      description: "Project created successfully",
    });
    navigate("/projects");
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Button 
        variant="ghost" 
        className="mb-4"
        onClick={() => navigate("/projects")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Projects
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>New Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input id="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Input id="client" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input id="deadline" type="date" />
            </div>
            <div className="pt-4">
              <Button type="submit">Create Project</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewProject;