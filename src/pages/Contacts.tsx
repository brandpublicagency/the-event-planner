import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContactsTable from "@/components/contacts/ContactsTable";
import ContactEditDrawer from "@/components/contacts/ContactEditDrawer";
import type { Contact } from "@/types/contact";

const Contacts = () => {
  const { toast } = useToast();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const { data: contacts = [], isLoading, refetch } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      try {
        const { data: weddingContacts, error: weddingError } = await supabase
          .from('wedding_details')
          .select(`
            *,
            events!inner(
              event_code,
              name,
              event_type,
              event_date,
              event_venues(
                venues(
                  id,
                  name
                )
              )
            )
          `)
          .order('updated_at', { ascending: false });

        if (weddingError) throw weddingError;

        const { data: corporateContacts, error: corporateError } = await supabase
          .from('corporate_details')
          .select(`
            *,
            events!inner(
              event_code,
              name,
              event_type,
              event_date,
              event_venues(
                venues(
                  id,
                  name
                )
              )
            )
          `)
          .order('updated_at', { ascending: false });

        if (corporateError) throw corporateError;

        const processedWeddingContacts: Contact[] = [];
        weddingContacts?.forEach(weddingDetail => {
          if (weddingDetail.bride_name) {
            processedWeddingContacts.push({
              id: `bride-${weddingDetail.event_code}`,
              name: weddingDetail.bride_name,
              email: weddingDetail.bride_email || '',
              phone: weddingDetail.bride_mobile || '',
              company: null,
              contactType: 'wedding-bride',
              eventCode: weddingDetail.event_code,
              eventName: weddingDetail.events.name,
              eventDate: weddingDetail.events.event_date,
              venue: weddingDetail.events.event_venues?.[0]?.venues?.name || 'Not specified',
              originalData: weddingDetail
            });
          }

          if (weddingDetail.groom_name) {
            processedWeddingContacts.push({
              id: `groom-${weddingDetail.event_code}`,
              name: weddingDetail.groom_name,
              email: weddingDetail.groom_email || '',
              phone: weddingDetail.groom_mobile || '',
              company: null,
              contactType: 'wedding-groom',
              eventCode: weddingDetail.event_code,
              eventName: weddingDetail.events.name,
              eventDate: weddingDetail.events.event_date,
              venue: weddingDetail.events.event_venues?.[0]?.venues?.name || 'Not specified',
              originalData: weddingDetail
            });
          }
        });

        const processedCorporateContacts: Contact[] = corporateContacts?.map(corporateDetail => ({
          id: `corporate-${corporateDetail.event_code}`,
          name: corporateDetail.contact_person || 'Not specified',
          email: corporateDetail.contact_email || '',
          phone: corporateDetail.contact_mobile || '',
          company: corporateDetail.company_name || 'Not specified',
          contactType: 'corporate',
          eventCode: corporateDetail.event_code,
          eventName: corporateDetail.events.name,
          eventDate: corporateDetail.events.event_date,
          venue: corporateDetail.events.event_venues?.[0]?.venues?.name || 'Not specified',
          originalData: corporateDetail
        })) || [];

        const allContacts = [...processedWeddingContacts, ...processedCorporateContacts];
        
        return allContacts.sort((a, b) => {
          if (!a.eventDate && !b.eventDate) return 0;
          if (!a.eventDate) return 1;
          if (!b.eventDate) return -1;
          return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime();
        });
      } catch (error: any) {
        console.error('Error fetching contacts:', error);
        toast({
          title: "Error",
          description: "Failed to fetch contacts",
          variant: "destructive",
        });
        return [];
      }
    },
  });

  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact);
    setIsEditDrawerOpen(true);
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

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 md:p-8">
        <h2 className="text-3xl font-bold tracking-tight">Contacts</h2>
      </div>

      <div className="p-4 md:p-8 pt-0">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="all">All Contacts</TabsTrigger>
              <TabsTrigger value="wedding">Wedding Contacts</TabsTrigger>
              <TabsTrigger value="corporate">Corporate Contacts</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="mt-0">
            <ContactsTable 
              contacts={filteredContacts} 
              isLoading={isLoading} 
              onEditContact={handleEditContact} 
            />
          </TabsContent>
          
          <TabsContent value="wedding" className="mt-0">
            <ContactsTable 
              contacts={filteredContacts} 
              isLoading={isLoading} 
              onEditContact={handleEditContact} 
            />
          </TabsContent>
          
          <TabsContent value="corporate" className="mt-0">
            <ContactsTable 
              contacts={filteredContacts} 
              isLoading={isLoading} 
              onEditContact={handleEditContact} 
            />
          </TabsContent>
        </Tabs>
      </div>

      {selectedContact && (
        <ContactEditDrawer
          contact={selectedContact}
          isOpen={isEditDrawerOpen}
          onClose={() => setIsEditDrawerOpen(false)}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default Contacts;
