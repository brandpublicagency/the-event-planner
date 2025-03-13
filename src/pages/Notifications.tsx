import React, { useState } from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const { notifications, markAsRead, markAllAsRead, clearNotifications } = useNotifications();
  const [filter, setFilter] = useState<string>("all");
  const navigate = useNavigate();
  
  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.read;
    return notification.type === filter;
  });
  
  const handleNotificationClick = (id: string, relatedId?: string, type?: string) => {
    markAsRead(id);
    
    if (relatedId) {
      if (type?.includes("event")) {
        navigate(`/events/${relatedId}`);
      } else if (type?.includes("task")) {
        navigate(`/tasks?selected=${relatedId}`);
      }
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <Header 
        pageTitle="Notifications" 
        actionButton={{
          label: "Clear All",
          onClick: clearNotifications,
          variant: "outline"
        }}
        secondaryAction={
          <Button variant="ghost" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        }
      />
      
      <div className="p-6">
        <Card>
          <Tabs defaultValue="all" className="w-full">
            <div className="px-4 pt-4">
              <TabsList className="grid grid-cols-5 mb-4">
                <TabsTrigger value="all" onClick={() => setFilter("all")}>
                  All
                </TabsTrigger>
                <TabsTrigger value="unread" onClick={() => setFilter("unread")}>
                  Unread
                </TabsTrigger>
                <TabsTrigger value="event_created" onClick={() => setFilter("event_created")}>
                  Events
                </TabsTrigger>
                <TabsTrigger value="task_overdue" onClick={() => setFilter("task_overdue")}>
                  Overdue
                </TabsTrigger>
                <TabsTrigger value="task_upcoming" onClick={() => setFilter("task_upcoming")}>
                  Upcoming
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="m-0">
              <div className="divide-y">
                {filteredNotifications.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                    No notifications found
                  </div>
                ) : (
                  filteredNotifications.map(notification => (
                    <div 
                      key={notification.id}
                      className="p-4 hover:bg-muted/30 cursor-pointer transition-colors"
                      onClick={() => handleNotificationClick(
                        notification.id, 
                        notification.relatedId, 
                        notification.type
                      )}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{notification.title}</h3>
                          {!notification.read && (
                            <Badge 
                              className="text-[10px] px-1.5 py-0.5 bg-primary text-primary-foreground rounded-md font-normal"
                            >
                              New
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {format(notification.createdAt, "MMM d, yyyy 'at' h:mm a")}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{notification.description}</p>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
            
            {/* Other tab contents are the same due to filtered state handling */}
            <TabsContent value="unread" className="m-0">
              <div className="divide-y">
                {filteredNotifications.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                    No notifications found
                  </div>
                ) : (
                  filteredNotifications.map(notification => (
                    <div 
                      key={notification.id}
                      className="p-4 hover:bg-muted/30 cursor-pointer transition-colors"
                      onClick={() => handleNotificationClick(
                        notification.id, 
                        notification.relatedId, 
                        notification.type
                      )}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{notification.title}</h3>
                          {!notification.read && (
                            <Badge 
                              className="text-[10px] px-1.5 py-0.5 bg-primary text-primary-foreground rounded-md font-normal"
                            >
                              New
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {format(notification.createdAt, "MMM d, yyyy 'at' h:mm a")}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{notification.description}</p>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
            
            {["event_created", "task_overdue", "task_upcoming"].map(tabValue => (
              <TabsContent key={tabValue} value={tabValue} className="m-0">
                <div className="divide-y">
                  {filteredNotifications.length === 0 ? (
                    <div className="p-6 text-center text-muted-foreground">
                      No notifications found
                    </div>
                  ) : (
                    filteredNotifications.map(notification => (
                      <div 
                        key={notification.id}
                        className="p-4 hover:bg-muted/30 cursor-pointer transition-colors"
                        onClick={() => handleNotificationClick(
                          notification.id, 
                          notification.relatedId, 
                          notification.type
                        )}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{notification.title}</h3>
                            {!notification.read && (
                              <Badge 
                                className="text-[10px] px-1.5 py-0.5 bg-primary text-primary-foreground rounded-md font-normal"
                              >
                                New
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {format(notification.createdAt, "MMM d, yyyy 'at' h:mm a")}
                          </span>
                        </div>
                        <p className="text-muted-foreground">{notification.description}</p>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Notifications;