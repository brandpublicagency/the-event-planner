
import React, { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useMenuItems } from "@/hooks/useMenuItems";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MenuItemsTable from "@/components/menu-items/MenuItemsTable";
import MenuItemDialog from "@/components/menu-items/MenuItemDialog";
import MenuSectionsManager from "@/components/menu-items/MenuSectionsManager";
import { MenuItemFormData } from "@/api/menuItemsApi";
import { PlusIcon } from "lucide-react";

const MyBusiness = () => {
  const {
    menuItems,
    isLoading,
    error,
    handleAddItem,
    handleUpdateItem,
    handleDeleteItem,
    editingItem,
    setEditingItem,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isCreating,
    isUpdating,
    isDeleting
  } = useMenuItems();

  const [activeTab, setActiveTab] = useState("items");

  const handleEditSubmit = (data: MenuItemFormData) => {
    if (editingItem) {
      handleUpdateItem(editingItem.id, data);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader 
        pageTitle="Menu Management"
        actionButton={activeTab === "items" ? {
          label: "Add Menu Item",
          onClick: () => setIsAddDialogOpen(true),
          icon: <PlusIcon className="h-4 w-4 mr-2" />
        } : undefined}
      />
      
      <div className="container mx-auto py-6 max-w-7xl">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="items">Menu Items</TabsTrigger>
              <TabsTrigger value="sections">Menu Sections</TabsTrigger>
            </TabsList>
            
            <TabsContent value="items">
              {isLoading ? (
                <div className="py-8 text-center text-gray-500">Loading menu items...</div>
              ) : error ? (
                <div className="py-8 text-center text-red-500">
                  Error loading menu items. Please try again.
                </div>
              ) : (
                <MenuItemsTable
                  items={menuItems}
                  onEdit={setEditingItem}
                  onDelete={handleDeleteItem}
                  isDeleting={isDeleting}
                />
              )}
            </TabsContent>
            
            <TabsContent value="sections">
              <MenuSectionsManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Add Menu Item Dialog */}
      <MenuItemDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddItem}
        isSubmitting={isCreating}
        title="Add Menu Item"
      />

      {/* Edit Menu Item Dialog */}
      <MenuItemDialog
        open={!!editingItem}
        onOpenChange={(open) => !open && setEditingItem(null)}
        onSubmit={handleEditSubmit}
        isSubmitting={isUpdating}
        initialData={editingItem || undefined}
        title="Edit Menu Item"
      />
    </div>
  );
};

export default MyBusiness;
