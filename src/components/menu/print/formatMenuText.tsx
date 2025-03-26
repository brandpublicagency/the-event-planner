
import React from 'react';

// Function to convert a plain text menu to JSX with proper formatting
export const formatMenuText = (menuText: string): JSX.Element => {
  if (!menuText) {
    return <p>No menu information available</p>;
  }

  // Split the text into sections - each section starts with a header
  const sections = menuText.split(/(?=ARRIVAL & STARTER|MAIN COURSE|DESSERT|ADDITIONAL OPTIONS|NOTES)/);

  return (
    <>
      {sections.map((section, index) => {
        if (!section.trim()) return null;

        // Identify the section header
        const headerMatch = section.match(/^(ARRIVAL & STARTER|MAIN COURSE|DESSERT|ADDITIONAL OPTIONS|NOTES):/);
        const header = headerMatch ? headerMatch[1] : '';
        
        // The content is everything after the header
        let content = headerMatch 
          ? section.substring(headerMatch[0].length).trim() 
          : section.trim();

        // Format content with bold menu type selections
        const lines = content.split('\n').map(line => line.trim());
        const formattedLines = lines.map((line, lineIndex) => {
          // Check if this is a menu type selection line
          const isMenuTypeSelection = 
            line.includes('Choice of') || 
            line === 'Plated Menu' ||
            line === 'Karoo Bush Table' ||
            line === 'Harvest Table' ||
            line === 'Traditional Baked Desserts' ||
            line === 'Individual Cakes' ||
            line === 'Dessert Canapés' ||
            line.includes('Buffet Menu');
          
          return (
            <p 
              key={lineIndex} 
              className={isMenuTypeSelection ? 'menu-type-selection mb-1' : 'mb-1'}
            >
              {line}
            </p>
          );
        });

        return (
          <div key={index} className="mb-4">
            {header && <h3 className="section-header">{header}</h3>}
            <div className="ml-0">
              {formattedLines}
            </div>
          </div>
        );
      })}
    </>
  );
};
