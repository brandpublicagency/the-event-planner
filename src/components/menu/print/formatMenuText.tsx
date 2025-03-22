
import React from 'react';

// Helper function to format the menu text with proper HTML structure
export const formatMenuText = (text: string): JSX.Element => {
  if (!text) return <></>;
  
  const lines = text.split('\n');
  return (
    <>
      {lines.map((line, index) => {
        if (line.startsWith('*')) {
          // This is a section header
          const headerText = line.replace('*', '').trim();
          return (
            <div key={index} className="section-header">
              {headerText}
            </div>
          );
        } else if (line.trim().endsWith(':')) {
          // This is a category label
          return <p key={index} className="category-label">{line}</p>;
        } else if (line.trim() === 'INDIVIDUAL CAKES' || 
                  line.trim().startsWith('DESSERT CANAPÉS') || 
                  line.trim().startsWith('CANAPÉS')) {
          // This is a subsection header
          return <p key={index} className="category-label" style={{ fontWeight: 'bold' }}>{line}</p>;
        } else if (line.trim()) {
          // This is a regular item - no special bullet or indentation
          return <p key={index} className="menu-item">{line}</p>;
        }
        return line.trim() ? <p key={index}>{line}</p> : <br key={index} />;
      })}
    </>
  );
};
