
import Tribute from 'tributejs';
import { debounce, getLoadingTemplate } from './utils';
import { searchMentionItems } from './searchService';
import { getSelectTemplate, getMenuItemTemplate, getNoMatchTemplate } from './templates';

export const createTributeInstance = () => {
  return new Tribute({
    collection: [{
      trigger: '/',
      values: debounce(async (text: string, callback: (items: any[]) => void) => {
        // Skip the / character in the search
        const searchQuery = text.substring(1);
        
        if (searchQuery.length < 2) {
          callback([]);
          return;
        }

        try {
          const results = await searchMentionItems(searchQuery);
          callback(results);
        } catch (error) {
          console.error('Error in tribute search:', error);
          callback([]);
        }
      }, 300),
      lookup: 'title',
      fillAttr: 'title',
      menuShowMinLength: 2,
      requireLeadingSpace: false,
      allowSpaces: true,
      searchOpts: {
        pre: '<span class="highlighted">',
        post: '</span>',
        skip: false
      },
      keys: {
        tab: 9,
        enter: null,
        up: 38,
        down: 40
      },
      selectTemplate: getSelectTemplate,
      menuItemTemplate: getMenuItemTemplate,
      noMatchTemplate: getNoMatchTemplate,
      loadingTemplate: getLoadingTemplate,
    }],
    positionMenu: true,
    containerClass: 'tribute-container',
  });
};
