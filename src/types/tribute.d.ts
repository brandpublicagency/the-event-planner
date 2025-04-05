
declare module 'tributejs' {
  export interface TributeItem {
    [key: string]: any;
  }

  export interface TributeCollection {
    trigger: string;
    selectTemplate?: (item: any) => string;
    menuItemTemplate?: (item: any) => string;
    values: TributeItem[] | ((text: string, cb: (values: TributeItem[]) => void) => void);
    lookup?: string;
    fillAttr?: string;
    selectClass?: string;
    containerClass?: string;
    itemClass?: string;
    noMatchTemplate?: () => string;
    loadingTemplate?: () => string;
    requireLeadingSpace?: boolean;
    allowSpaces?: boolean;
    replaceTextSuffix?: string;
    menuItemLimit?: number;
    menuShowMinLength?: number;
    searchOpts?: {
      pre: string;
      post: string;
      skip: boolean;
    };
    keys?: {
      tab?: number;
      enter?: number | null;
      up?: number;
      down?: number;
      escape?: number;
    };
  }

  export interface TributeOptions {
    collection?: TributeCollection | TributeCollection[];
    positionMenu?: boolean;
    menuContainer?: Element;
    iframe?: any;
    selectClass?: string;
    containerClass?: string;
    itemClass?: string;
    trigger?: string;
    autocompleteMode?: boolean;
    noMatchTemplate?: () => string;
    loadingTemplate?: () => string;
    menuItemLimit?: number;
    menuShowMinLength?: number;
    fillAttr?: string;
    selectTemplate?: (item: any) => string;
    menuItemTemplate?: (item: any) => string;
    lookup?: string;
    requireLeadingSpace?: boolean;
    allowSpaces?: boolean;
    replaceTextSuffix?: string;
    searchOpts?: {
      pre: string;
      post: string;
      skip: boolean;
    };
  }

  export default class Tribute {
    constructor(options: TributeOptions);
    attach(element: Element | NodeList): void;
    detach(element: Element): void;
    appendMenuTo(element: Element): void;
    showMenuFor(element: Element, scrollTo?: boolean): void;
    hideMenu(): void;
    isActive: boolean;
  }
}
