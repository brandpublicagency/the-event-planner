import React from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Calendar, 
  Users, 
  FileText, 
  DollarSign,
  TrendingUp
} from "lucide-react";

const MyBusiness = () => {
  return (
    <div className="flex flex-col h-full">
      <PageHeader 
        pageTitle="My Business"
        actionButton={{
          label: "Create Report",
          onClick: () => console.log("Create report clicked")
        }}
      />
      
      <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">My Business</h1>
        <div className="flex gap-2">
          <Button variant="outline">Export</Button>
          <Button>Create Report</Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="finances">Finances</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <MetricCard 
              title="Total Events" 
              value="124" 
              change="+12%" 
              trend="up" 
              icon={<Calendar className="h-5 w-5 text-muted-foreground" />} 
            />
            <MetricCard 
              title="Total Revenue" 
              value="$283,405" 
              change="+18%" 
              trend="up" 
              icon={<DollarSign className="h-5 w-5 text-muted-foreground" />} 
            />
            <MetricCard 
              title="Total Clients" 
              value="87" 
              change="+5%" 
              trend="up" 
              icon={<Users className="h-5 w-5 text-muted-foreground" />} 
            />
            <MetricCard 
              title="Contracts" 
              value="92" 
              change="+8%" 
              trend="up" 
              icon={<FileText className="h-5 w-5 text-muted-foreground" />} 
            />
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <Card className="p-6">
              <h3 className="font-medium text-lg mb-4 flex items-center">
                <BarChart className="w-5 h-5 mr-2" />
                Revenue Breakdown
              </h3>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Chart visualization will appear here
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="font-medium text-lg mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Event Growth
              </h3>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Chart visualization will appear here
              </div>
            </Card>
          </div>
          
          <Card className="p-6">
            <h3 className="font-medium text-lg mb-4">Recent Business Activity</h3>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex justify-between items-center border-b pb-3 last:border-0">
                  <div>
                    <p className="font-medium">New contract signed</p>
                    <p className="text-sm text-muted-foreground">Johnson Wedding • $12,500</p>
                  </div>
                  <span className="text-sm text-muted-foreground">2 days ago</span>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="finances">
          <Card className="p-6">
            <h3 className="font-medium text-lg mb-4">Financial Overview</h3>
            <p className="text-muted-foreground">
              Detailed financial information will be displayed here. This section will include revenue 
              reports, expense tracking, profit margins, and financial forecasts.
            </p>
          </Card>
        </TabsContent>
        
        <TabsContent value="insights">
          <Card className="p-6">
            <h3 className="font-medium text-lg mb-4">Business Insights</h3>
            <p className="text-muted-foreground">
              Business analytics and insights will be displayed here. This section will include 
              client demographics, popular services, seasonal trends, and growth opportunities.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </div>
  );
};

// Metric Card Component for Business Dashboard
const MetricCard = ({ title, value, change, trend, icon }) => {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon}
      </div>
      <div className="flex justify-between items-baseline">
        <p className="text-2xl font-bold">{value}</p>
        <span className={`text-xs px-1.5 py-0.5 rounded-md ${
          trend === "up" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
        }`}>
          {change}
        </span>
      </div>
    </Card>
  );
};

export default MyBusiness;
