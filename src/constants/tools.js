export const TOOLS = {
  'opd-dates': {
    id: 'opd-dates',
    name: 'Pickable Dates',
    short: 'Dates',
    icon: 'calendar_today',
    department: 'OPD'
  },
  'tote-label': {
    id: 'tote-label',
    name: 'Tote Barcode',
    short: 'Totes',
    icon: 'qr_code',
    department: 'OPD'
  },
  'plu-search': {
    id: 'plu-search',
    name: 'PLU Lookup',
    short: 'PLUs',
    icon: 'search',
    department: 'Fresh'
  },
  'meat-dates': {
    id: 'meat-dates',
    name: 'Meat & Seafood',
    short: 'Meat',
    icon: 'set_meal',
    department: 'Fresh'
  },
  'vizpick': {
    id: 'vizpick',
    name: 'Vizpick Labels',
    short: 'Vizpick',
    icon: 'inventory_2',
    department: 'Tools'
  }
};
export const DEFAULT_TOOL = 'opd-dates';
export const DEFAULT_BOTTOM_NAV = ['opd-dates', 'meat-dates', 'vizpick', 'plu-search'];
export const MAX_BOTTOM_NAV = 4;

