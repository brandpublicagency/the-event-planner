
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
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
      <div className="mb-6">
        <TabsList className="bg-gray-50 p-1.5 rounded-xl border border-gray-100">
          <TabsTrigger 
            value="all" 
            className="px-5 py-2 data-[state=active]:shadow-md data-[state=active]:bg-white"
          >
            All Contacts
          </TabsTrigger>
          <TabsTrigger 
            value="wedding-bride" 
            className="px-5 py-2 data-[state=active]:shadow-md data-[state=active]:bg-white"
          >
            Wedding Contacts
          </TabsTrigger>
          <TabsTrigger 
            value="corporate" 
            className="px-5 py-2 data-[state=active]:shadow-md data-[state=active]:bg-white"
          >
            Corporate Contacts
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="all" className="mt-0 h-[calc(100vh-12rem)]">
        <ContactsTable contacts={contacts} isLoading={isLoading} onEditContact={onEditContact} onDeleteContact={onDeleteContact} hideSearch={true} />
      </TabsContent>
      
      <TabsContent value="wedding-bride" className="mt-0 h-[calc(100vh-12rem)]">
        <ContactsTable contacts={contacts.filter(c => c.contactType === 'wedding-bride')} isLoading={isLoading} onEditContact={onEditContact} onDeleteContact={onDeleteContact} hideSearch={true} />
      </TabsContent>
      
      <TabsContent value="corporate" className="mt-0 h-[calc(100vh-12rem)]">
        <ContactsTable contacts={contacts.filter(c => c.contactType === 'corporate')} isLoading={isLoading} onEditContact={onEditContact} onDeleteContact={onDeleteContact} hideSearch={true} />
      </TabsContent>
    </Tabs>
  );
};

export default ContactsTabs;
