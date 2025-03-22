
import React from 'react';
import { formatNotes } from './menuItemUtils';

interface MenuNotesSectionProps {
  notes: string;
}

const MenuNotesSection: React.FC<MenuNotesSectionProps> = ({ notes }) => {
  if (!notes) return null;
  
  return (
    <div style={{ marginBottom: '16px' }}>
      <h3 style={{ fontSize: '14px', fontWeight: 'normal', marginBottom: '8px' }}>Additional Notes</h3>
      <div style={{ whiteSpace: 'pre-line' }}>
        {formatNotes(notes)}
      </div>
    </div>
  );
};

export default MenuNotesSection;
