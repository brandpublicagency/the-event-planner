export interface EventOverviewPanel {
  key: string;
  title: string;
  type: 'richtext' | 'list';
  value?: string;
  items?: string[];
  imageUrl?: string;
}

export interface EventOverview {
  panels: EventOverviewPanel[];
  visible: boolean;
}

export const createDefaultOverview = (): EventOverview => ({
  panels: [
    { key: 'venue_layout', title: 'Venue Layout', type: 'richtext', value: '', imageUrl: '' },
    { key: 'pre_drinks', title: 'Pre-drinks', type: 'list', items: [] },
    { key: 'menu', title: 'Menu', type: 'richtext', value: '' }
  ],
  visible: true
});
