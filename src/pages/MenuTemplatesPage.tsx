
import React from 'react';
import { PageHeader } from '@/components/PageHeader';
import MenuTemplates from '@/components/menu-templates/MenuTemplates';

const MenuTemplatesPage = () => {
  return (
    <div className="flex flex-col h-full">
      <PageHeader pageTitle="Menu Templates" />
      <div className="container mx-auto py-6 max-w-7xl">
        <MenuTemplates />
      </div>
    </div>
  );
};

export default MenuTemplatesPage;
