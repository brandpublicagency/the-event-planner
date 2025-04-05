
import { toast } from '@/components/ui/toast';

// Event handlers for mention functionality
export const attachMentionClickHandler = (editorDOM: HTMLElement) => {
  editorDOM.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const mentionElement = target.closest('.mention');
    
    if (mentionElement) {
      e.preventDefault();
      
      const url = mentionElement.getAttribute('data-mention-url');
      const type = mentionElement.getAttribute('data-mention-type');
      const title = mentionElement.getAttribute('data-mention-title');
      
      if (url) {
        // Navigate to the URL
        window.location.href = url;
      }
    }
  });
};

export const attachMentionTooltipHandler = (editorDOM: HTMLElement) => {
  editorDOM.addEventListener('mouseover', (e) => {
    const target = e.target as HTMLElement;
    const mentionElement = target.closest('.mention');
    
    if (mentionElement) {
      const type = mentionElement.getAttribute('data-mention-type');
      const title = mentionElement.getAttribute('data-mention-title');
      
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
      
      // Add tooltip
      const tooltip = document.createElement('div');
      tooltip.className = 'mention-tooltip';
      tooltip.textContent = tooltipText;
      
      // Position tooltip
      const rect = mentionElement.getBoundingClientRect();
      tooltip.style.top = `${rect.bottom + window.scrollY + 10}px`;
      tooltip.style.left = `${rect.left + window.scrollX}px`;
      
      document.body.appendChild(tooltip);
      
      // Remove tooltip on mouseout
      mentionElement.addEventListener('mouseout', () => {
        document.body.removeChild(tooltip);
      }, { once: true });
    }
  });
};

export const attachTabHandler = (editorDOM: HTMLElement, editorView: any) => {
  editorDOM.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      // Insert a slash to trigger the mention menu
      const { state, view } = editorView;
      const { $head } = state.selection;
      
      // Only trigger if not already in a mention
      if (!$head.nodeBefore || $head.nodeBefore.text?.endsWith('/')) {
        return;
      }
      
      // Insert the slash character
      view.dispatch(state.tr.insertText('/'));
      e.preventDefault();
    }
  });
};
