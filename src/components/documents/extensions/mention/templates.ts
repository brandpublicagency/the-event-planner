
// Template functions for mention UI elements
export const getSelectTemplate = (item: any) => {
  if (item.original.isHeader) {
    return ''; // Don't insert headers
  }
  
  return `<span 
    class="mention mention-${item.original.type}" 
    data-mention-id="${item.original.id}" 
    data-mention-type="${item.original.type}" 
    data-mention-url="${item.original.url}"
    data-mention-title="${item.original.title}"
    contenteditable="false">
    <span class="mention-icon">${item.original.icon}</span>
    <span class="mention-title">${item.original.title}</span>
  </span>`;
};

export const getMenuItemTemplate = (item: any) => {
  if (item.original.isHeader) {
    return `<div class="tribute-item tribute-header">
      <span class="mention-header-title">${item.original.title}</span>
    </div>`;
  }
  
  return `<div class="tribute-item tribute-item-${item.original.type}">
    <span class="mention-icon">${item.original.icon}</span>
    <div class="mention-info">
      <span class="mention-title">${item.original.title}</span>
    </div>
  </div>`;
};

export const getNoMatchTemplate = () => {
  return '<div class="tribute-item tribute-no-match">No matches found</div>';
};
