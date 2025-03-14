
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import type { Contact } from "@/types/contact";

interface ContactsTableProps {
  contacts: Contact[];
  isLoading: boolean;
  onEditContact: (contact: Contact) => void;
  onDeleteContact: (contact: Contact) => void;
  hideSearch?: boolean;
}

const ContactsTable = ({
  contacts,
  isLoading,
  onEditContact,
  onDeleteContact,
  hideSearch = false
}: ContactsTableProps) => {
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

  const handleDeleteClick = (contact: Contact) => {
    setContactToDelete(contact);
  };

  const handleConfirmDelete = () => {
    if (contactToDelete) {
      onDeleteContact(contactToDelete);
      setContactToDelete(null);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading contacts...</p>
      </div>;
  }

  return <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden h-full">
        <ScrollArea className="h-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left pl-0 bg-transparent font-bold text-black">Name</TableHead>
                <TableHead className="font-bold text-black">Company</TableHead>
                <TableHead className="font-bold text-black">Email</TableHead>
                <TableHead className="font-bold text-black">Phone</TableHead>
                <TableHead className="w-[100px] font-bold text-black">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.length === 0 ? <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                    No contacts found
                  </TableCell>
                </TableRow> : contacts.map(contact => <TableRow key={contact.id} className="border-b hover:bg-transparent">
                    <TableCell className="pl-0">
                      <button onClick={() => onEditContact(contact)} className="text-left transition-colors text-gray-800 font-normal text-sm">
                        {contact.name}
                      </button>
                    </TableCell>
                    <TableCell className="text-gray-400">{contact.company || "-"}</TableCell>
                    <TableCell className="text-gray-400">{contact.email || "-"}</TableCell>
                    <TableCell className="text-gray-400">{contact.phone || "-"}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => onEditContact(contact)}>
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(contact)}>
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>)}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
      
      <AlertDialog open={!!contactToDelete} onOpenChange={open => !open && setContactToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contact</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {contactToDelete?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 hover:bg-red-600 text-white" onClick={handleConfirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>;
};

export default ContactsTable;
