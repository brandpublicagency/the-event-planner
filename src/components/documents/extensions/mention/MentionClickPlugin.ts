
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { toast } from '@/components/ui/toast';

export const createMentionClickPlugin = () => {
  return new Plugin({
    key: new PluginKey('mention-click-handler'),
    props: {
      handleClick: (view, pos, event) => {
        const { state } = view;
        const { doc } = state;
        const target = event.target;
        
        if (target instanceof HTMLElement && target.closest('.mention, .mention-container')) {
          const mentionEl = target.closest('.mention, .mention-container');
          if (!mentionEl) return false;
          
          let url;
          
          // Handle potentially different DOM structures
          if (mentionEl.hasAttribute('data-url')) {
            url = mentionEl.getAttribute('data-url');
          } else {
            url = mentionEl.querySelector('[data-url]')?.getAttribute('data-url');
          }
          
          if (url) {
            event.preventDefault();
            
            toast.info(`Navigating to ${mentionEl.textContent.trim()}`);
            window.location.href = url;
            return true;
          }
        }
        
        return false;
      },
    },
  });
};
