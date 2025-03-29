
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";

const EmptyState: React.FC = () => {
  return (
    <TableRow>
      <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
        No menu items found. Click "Add Item" to create one.
      </TableCell>
    </TableRow>
  );
};

export default EmptyState;
