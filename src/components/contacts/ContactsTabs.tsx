
import React from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
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
    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
      <TabsContent value="all" className="flex-1 overflow-hidden h-full">
        <ContactsTable contacts={contacts} isLoading={isLoading} onEditContact={onEditContact} onDeleteContact={onDeleteContact} hideSearch={true} />
      </TabsContent>
      
      <TabsContent value="wedding-bride" className="flex-1 overflow-hidden h-full">
        <ContactsTable contacts={contacts.filter(c => c.contactType === 'wedding-bride')} isLoading={isLoading} onEditContact={onEditContact} onDeleteContact={onDeleteContact} hideSearch={true} />
      </TabsContent>
      
      <TabsContent value="corporate" className="flex-1 overflow-hidden h-full">
        <ContactsTable contacts={contacts.filter(c => c.contactType === 'corporate')} isLoading={isLoading} onEditContact={onEditContact} onDeleteContact={onDeleteContact} hideSearch={true} />
      </TabsContent>
    </Tabs>
  );
};

export default ContactsTabs;
