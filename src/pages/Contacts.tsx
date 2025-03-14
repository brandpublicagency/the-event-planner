
import ContactsPage from "@/components/contacts/ContactsPage";
import { Header } from "@/components/layout/Header";

const Contacts = () => {
  return (
    <div className="flex flex-col h-full">
      <Header pageTitle="Contacts" />
      <div className="flex-1 overflow-hidden">
        <ContactsPage />
      </div>
    </div>
  );
};

export default Contacts;
