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
    department: 'Tools',
    isStub: true
  },
  'julian': {
    id: 'julian',
    name: 'Julian Calendar',
    short: 'Julian',
    icon: 'today',
    department: 'General'
  },
  'share': {
    id: 'share',
    name: 'Share Tool',
    short: 'Share',
    icon: 'share',
    department: 'General'
  }
};

export const ROLES = {
  opd: {
    id: 'opd',
    label: 'OPD / Fulfillment',
    short: 'OPD',
    defaultTool: 'opd-dates',
    bottomNav: ['opd-dates', 'tote-label', 'plu-search']
  },
  fresh: {
    id: 'fresh',
    label: 'Meat & Produce',
    short: 'Fresh',
    defaultTool: 'meat-dates',
    bottomNav: ['meat-dates', 'plu-search', 'vizpick']
  },
  salesfloor: {
    id: 'salesfloor',
    label: 'Sales Floor',
    short: 'Floor',
    defaultTool: 'plu-search',
    bottomNav: ['plu-search', 'opd-dates', 'julian']
  }
};

export const DEFAULT_ROLE = 'opd';
