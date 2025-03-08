
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContactsTable from "./ContactsTable";
import type { Contact } from "@/types/contact";

interface ContactsTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  contacts: Contact[];
  isLoading: boolean;
  onEditContact: (contact: Contact) => void;
  onDeleteContact: (contact: Contact) => void;
}

const ContactsTabs = ({
  activeTab,
  setActiveTab,
  contacts,
  isLoading,
  onEditContact,
  onDeleteContact
}: ContactsTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="flex items-center justify-between mb-4">
        <TabsList>
          <TabsTrigger value="all">All Contacts</TabsTrigger>
          <TabsTrigger value="wedding">Wedding Contacts</TabsTrigger>
          <TabsTrigger value="corporate">Corporate Contacts</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="all" className="mt-0">
        <ContactsTable 
          contacts={contacts} 
          isLoading={isLoading} 
          onEditContact={onEditContact}
          onDeleteContact={onDeleteContact}
        />
      </TabsContent>
      
      <TabsContent value="wedding" className="mt-0">
        <ContactsTable 
          contacts={contacts} 
          isLoading={isLoading} 
          onEditContact={onEditContact}
          onDeleteContact={onDeleteContact}
        />
      </TabsContent>
      
      <TabsContent value="corporate" className="mt-0">
        <ContactsTable 
          contacts={contacts} 
          isLoading={isLoading} 
          onEditContact={onEditContact}
          onDeleteContact={onDeleteContact}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ContactsTabs;
