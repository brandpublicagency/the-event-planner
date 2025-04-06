
import { Plugin, PluginKey } from '@tiptap/pm/state';

export const createMentionTooltipPlugin = () => {
  return new Plugin({
    key: new PluginKey('mention-tooltip'),
    view: () => {
      let tooltip = null;
      
      const handleMouseOver = (event) => {
        const target = event.target;
        
        if (target instanceof HTMLElement && target.closest('.mention, .mention-container')) {
          const mentionEl = target.closest('.mention, .mention-container');
          if (!mentionEl || tooltip) return;
          
          let type, title, url;
          
          // Handle potentially different DOM structures
          if (mentionEl.hasAttribute('data-type')) {
            type = mentionEl.getAttribute('data-type');
            title = mentionEl.textContent.trim();
            url = mentionEl.getAttribute('data-url');
          } else {
            type = mentionEl.querySelector('[data-type]')?.getAttribute('data-type');
            title = mentionEl.textContent.trim();
            url = mentionEl.querySelector('[data-url]')?.getAttribute('data-url');
          }
          
          if (!type || !url) return;
          
          let tooltipText = '';
          switch (type) {
            case 'document':
              tooltipText = `View document: ${title}`;
              break;
            case 'task':
              tooltipText = `View task: ${title}`;
              break;
            case 'event':
              tooltipText = `View event: ${title}`;
              break;
            case 'user':
              tooltipText = `View profile: ${title}`;
              break;
          }
          
          // Create tooltip
          tooltip = document.createElement('div');
          tooltip.className = 'mention-tooltip';
          tooltip.textContent = tooltipText;
          
          // Position tooltip
          const rect = mentionEl.getBoundingClientRect();
          tooltip.style.top = `${rect.bottom + window.scrollY + 10}px`;
          tooltip.style.left = `${rect.left + window.scrollX}px`;
          
          document.body.appendChild(tooltip);
          
          // Add mouseout event to remove tooltip
          const removeTooltip = () => {
            if (tooltip && document.body.contains(tooltip)) {
              document.body.removeChild(tooltip);
            }
            tooltip = null;
            mentionEl.removeEventListener('mouseout', removeTooltip);
          };
          
          mentionEl.addEventListener('mouseout', removeTooltip);
        }
      };
      
      document.addEventListener('mouseover', handleMouseOver);
      
      return {
        destroy: () => {
          document.removeEventListener('mouseover', handleMouseOver);
          
          if (tooltip && document.body.contains(tooltip)) {
            document.body.removeChild(tooltip);
          }
        },
      };
    },
  });
};
