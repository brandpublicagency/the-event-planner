import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const Clients = () => {
  const navigate = useNavigate();
  const clients = [
    { id: 1, name: "Acme Corp", email: "contact@acme.com", projects: 3, status: "Active" },
    { id: 2, name: "Globex Corporation", email: "info@globex.com", projects: 5, status: "Active" },
    { id: 3, name: "Soylent Corp", email: "hello@soylent.com", projects: 2, status: "Inactive" },
  ];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Clients</h2>
        <Button onClick={() => navigate("/clients/new")}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search clients..." className="pl-8" />
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <Card 
              key={client.id} 
              className="cursor-pointer transition-all duration-300 bg-gradient-to-r hover:from-white hover:to-zinc-50"
              onClick={() => navigate(`/clients/${client.id}`)}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  {client.name}
                  <span className={`text-xs px-2 py-1 rounded-full border border-zinc-200 bg-white ${
                    client.status === "Active" ? "text-green-600" : "text-zinc-500"
                  }`}>
                    {client.status}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-zinc-600">
                  <p>{client.email}</p>
                  <p className="mt-2">{client.projects} Active Projects</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Clients;