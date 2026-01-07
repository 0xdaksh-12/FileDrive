export const ICONS = {
  navigation: {
    home: 'home',
    dashboard: 'dashboard',
    menu: 'menu',
    close: 'close',
    arrowBack: 'arrow_back',
    arrowForward: 'arrow_forward',
    chevronLeft: 'chevron_left',
    chevronRight: 'chevron_right',
    expandMore: 'expand_more',
  },
  actions: {
    add: 'add',
    edit: 'edit',
    delete: 'delete',
    save: 'save',
    check: 'check',
    refresh: 'refresh',
    download: 'download',
    upload: 'upload',
    share: 'share',
    contentCopy: 'content_copy',
    link: 'link',
    qrCode: 'qr_code_2',
    visibility: 'visibility',
    visibilityOff: 'visibility_off',
  },
  user: {
    person: 'person',
    accountCircle: 'account_circle',
    group: 'group',
    login: 'login',
    logout: 'logout',
    settings: 'settings',
    lock: 'lock',
    lockOpen: 'lock_open',
  },
  security: {
    gppGood: 'gpp_good',
    gppBad: 'gpp_bad',
    gppMaybe: 'gpp_maybe',
    bugReport: 'bug_report',
  },
  analytics: {
    barChart: 'bar_chart',
    pieChart: 'pie_chart',
    trendingUp: 'trending_up',
    language: 'language',
    devices: 'devices',
  },
  status: {
    hourglassEmpty: 'hourglass_empty',
    schedule: 'schedule',
  },
} as const;

export type IconName = {
  [K in keyof typeof ICONS]: (typeof ICONS)[K][keyof (typeof ICONS)[K]];
}[keyof typeof ICONS];

export const ICON_SIZES = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-4xl',
  '2xl': 'text-6xl',
} as const;

export type IconSize = keyof typeof ICON_SIZES;
