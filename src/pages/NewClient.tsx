import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const NewClient = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Success",
      description: "Client created successfully",
    });
    navigate("/clients");
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Button 
        variant="ghost" 
        className="mb-4"
        onClick={() => navigate("/clients")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Clients
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>New Client</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input id="name" placeholder="Company Name" required />
            <Input id="email" type="email" placeholder="Email" required />
            <Input id="phone" type="tel" placeholder="Phone" />
            <Input id="address" placeholder="Address" />
            <div className="pt-2">
              <Button type="submit">Create Client</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewClient;