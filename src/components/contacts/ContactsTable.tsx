
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, User } from "lucide-react";
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
    return (
      <div className="flex items-center justify-center h-full rounded-lg bg-gray-50 border border-gray-100">
        <p className="text-muted-foreground flex items-center gap-2">
          <span className="inline-block h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin"></span>
          Loading contacts...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden h-full rounded-lg border border-gray-100">
        <ScrollArea className="h-full">
          <Table>
            <TableHeader className="bg-gray-50 sticky top-0">
              <TableRow>
                <TableHead className="text-left pl-4 font-bold text-black">Name</TableHead>
                <TableHead className="font-bold text-black">Company</TableHead>
                <TableHead className="font-bold text-black">Email</TableHead>
                <TableHead className="font-bold text-black">Phone</TableHead>
                <TableHead className="w-[100px] text-right pr-4 font-bold text-black">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2 py-8">
                      <User className="h-10 w-10 text-gray-300" />
                      <p>No contacts found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                contacts.map(contact => (
                  <TableRow key={contact.id} className="border-b hover:bg-gray-50">
                    <TableCell className="pl-4">
                      <button 
                        onClick={() => onEditContact(contact)} 
                        className="text-left font-medium transition-colors text-gray-800 hover:text-black hover:underline"
                      >
                        {contact.name}
                      </button>
                    </TableCell>
                    <TableCell className="text-gray-600">{contact.company || "-"}</TableCell>
                    <TableCell className="text-gray-600">{contact.email || "-"}</TableCell>
                    <TableCell className="text-gray-600">{contact.phone || "-"}</TableCell>
                    <TableCell className="text-right pr-2">
                      <div className="flex justify-end space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => onEditContact(contact)}
                          className="h-8 w-8 rounded-full hover:bg-gray-100"
                        >
                          <Edit className="h-4 w-4 text-gray-500" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteClick(contact)}
                          className="h-8 w-8 rounded-full hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
      
      <AlertDialog open={!!contactToDelete} onOpenChange={open => !open && setContactToDelete(null)}>
        <AlertDialogContent className="max-w-md rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contact</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {contactToDelete?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600 text-white rounded-lg" 
              onClick={handleConfirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContactsTable;
