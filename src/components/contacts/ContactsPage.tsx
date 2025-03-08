
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import ContactsTabs from "./ContactsTabs";
import { PageHeader } from "@/components/PageHeader";
import ContactEditDrawer from "./ContactEditDrawer";
import { useContactsQuery } from "./hooks/useContactsQuery";
import type { Contact } from "@/types/contact";
import { deleteContact } from "@/services/contactService";
import { Plus } from "lucide-react";

const ContactsPage = () => {
  const { toast } = useToast();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const { data: contacts = [], isLoading, refetch } = useContactsQuery();

  const handleAddContact = () => {
    setSelectedContact(null);
    setIsEditDrawerOpen(true);
  };

  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact);
    setIsEditDrawerOpen(true);
  };

  const handleDeleteContact = async (contact: Contact) => {
    try {
      await deleteContact(contact);
      refetch();
      toast({
        title: "Success",
        description: `Contact ${contact.name} has been deleted`,
      });
    } catch (error: any) {
      console.error('Error deleting contact:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete contact",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSuccess = () => {
    refetch();
    setIsEditDrawerOpen(false);
    setSelectedContact(null);
  };

  const filteredContacts = activeTab === "all" 
    ? contacts 
    : activeTab === "wedding" 
      ? contacts.filter(c => c.contactType.startsWith('wedding')) 
      : contacts.filter(c => c.contactType === 'corporate');

  const actionButton = {
    label: "Add Contact",
    icon: <Plus className="h-4 w-4" />,
    onClick: handleAddContact
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        contextTitle="Contact Management"
        pageTitle="Contacts"
        actionButton={actionButton}
      >
        <div className="pt-4">
          <ContactsTabs 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
      </PageHeader>
      
      <div className="p-6">
        <ContactsTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          contacts={filteredContacts}
          isLoading={isLoading}
          onEditContact={handleEditContact}
          onDeleteContact={handleDeleteContact}
        />
      </div>

      {isEditDrawerOpen && (
        <ContactEditDrawer
          contact={selectedContact}
          isOpen={isEditDrawerOpen}
          onClose={() => setIsEditDrawerOpen(false)}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
}

export default ContactsPage;
