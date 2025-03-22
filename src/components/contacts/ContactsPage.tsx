
import { useState } from "react";
import ContactsTabs from "./ContactsTabs";
import ContactEditDrawer from "./ContactEditDrawer";
import { useContactsQuery } from "./hooks/useContactsQuery";
import type { Contact } from "@/types/contact";
import { deleteContact } from "@/services/contactService";

const ContactsPage = () => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const {
    data: contacts = [],
    isLoading,
    refetch
  } = useContactsQuery();

  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact);
    setIsEditDrawerOpen(true);
  };

  const handleDeleteContact = async (contact: Contact) => {
    try {
      await deleteContact(contact);
      refetch();
      console.log(`Contact ${contact.name} has been deleted`);
    } catch (error: any) {
      console.error('Error deleting contact:', error);
    }
  };

  const handleUpdateSuccess = () => {
    refetch();
    setIsEditDrawerOpen(false);
    setSelectedContact(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden px-8 pt-5 pb-8 bg-white shadow-sm">
        <ContactsTabs 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          contacts={contacts} 
          isLoading={isLoading} 
          onEditContact={handleEditContact} 
          onDeleteContact={handleDeleteContact} 
        />
      </div>

      {isEditDrawerOpen && <ContactEditDrawer contact={selectedContact} isOpen={isEditDrawerOpen} onClose={() => setIsEditDrawerOpen(false)} onUpdateSuccess={handleUpdateSuccess} />}
    </div>
  );
};

export default ContactsPage;
