import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContactsTable from "./ContactsTable";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const filteredContacts = contacts.filter(contact => contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || contact.company && contact.company.toLowerCase().includes(searchTerm.toLowerCase()) || contact.email.toLowerCase().includes(searchTerm.toLowerCase()) || contact.phone.includes(searchTerm));
  return <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      

      <TabsContent value="all" className="mt-0">
        <ContactsTable contacts={filteredContacts} isLoading={isLoading} onEditContact={onEditContact} onDeleteContact={onDeleteContact} hideSearch={true} />
      </TabsContent>
      
      <TabsContent value="wedding-bride" className="mt-0">
        <ContactsTable contacts={filteredContacts.filter(c => c.contactType === 'wedding-bride')} isLoading={isLoading} onEditContact={onEditContact} onDeleteContact={onDeleteContact} hideSearch={true} />
      </TabsContent>
      
      <TabsContent value="corporate" className="mt-0">
        <ContactsTable contacts={filteredContacts.filter(c => c.contactType === 'corporate')} isLoading={isLoading} onEditContact={onEditContact} onDeleteContact={onDeleteContact} hideSearch={true} />
      </TabsContent>
    </Tabs>;
};
export default ContactsTabs;