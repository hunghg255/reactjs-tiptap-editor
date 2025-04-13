/** Default lang */
export const DEFAULT_LANG_VALUE = 'en';

/** Throttle time for editor input (milliseconds) */
export const EDITOR_UPDATE_THROTTLE_WAIT_TIME = 200;

/**
 * watch throttling time must be less than the update time
 * otherwise the cursor position will reach the end
 */
export const EDITOR_UPDATE_WATCH_THROTTLE_WAIT_TIME = EDITOR_UPDATE_THROTTLE_WAIT_TIME - 80;

/** Minimum size for image adjustments */
export const IMAGE_MIN_SIZE = 20;
/** Maximum size for image adjustments */
export const IMAGE_MAX_SIZE = 100_000;
/** Throttle time during adjustments for images (milliseconds) */
export const IMAGE_THROTTLE_WAIT_TIME = 16;

/** Default number of rows and columns for grids when creating a table */
export const TABLE_INIT_GRID_SIZE = 10;
/** Maximum number of rows and columns for grids when creating a table */
export const TABLE_MAX_GRID_SIZE = 10;
/** Minimum number of rows and columns for grids when creating a table */
export const TABLE_DEFAULT_SELECTED_GRID_SIZE = 2;

export const DEFAULT_COLOR = '#262626';
/** Default color list for text color and text highlight */
export const COLORS_LIST = [
  '#000000',
  '#262626',
  '#595959',
  '#8C8C8C',
  '#BFBFBF',
  '#D9D9D9',
  '#E9E9E9',
  '#F5F5F5',
  '#FAFAFA',
  '#FFFFFF',
  '#F5222D',
  '#FA541C',
  '#FA8C16',
  '#FADB14',
  '#52C41A',
  '#13C2C2',
  '#1890FF',
  '#2F54EB',
  '#722ED1',
  '#EB2F96',
  '#FFE8E6',
  '#FFECE0',
  '#FFEFD1',
  '#FCFCCA',
  '#E4F7D2',
  '#D3F5F0',
  '#D4EEFC',
  '#DEE8FC',
  '#EFE1FA',
  '#FAE1EB',
  '#FFA39E',
  '#FFBB96',
  '#FFD591',
  '#FFFB8F',
  '#B7EB8F',
  '#87E8DE',
  '#91D5FF',
  '#ADC6FF',
  '#D3ADF7',
  '#FFADD2',
  '#FF4D4F',
  '#FF7A45',
  '#FFA940',
  '#FFEC3D',
  '#73D13D',
  '#36CFC9',
  '#40A9FF',
  '#597EF7',
  '#9254DE',
  '#F759AB',
  '#CF1322',
  '#D4380D',
  '#D46B08',
  '#D4B106',
  '#389E0D',
  '#08979C',
  '#096DD9',
  '#1D39C4',
  '#531DAB',
  '#C41D7F',
  '#820014',
  '#871400',
  '#873800',
  '#614700',
  '#135200',
  '#00474F',
  '#003A8C',
  '#061178',
  '#22075E',
  '#780650',
] as const;

/** Default font family list */
export const DEFAULT_FONT_FAMILY_LIST = [
  'Inter',
  'Comic Sans MS, Comic Sans',
  'serif',
  'cursive',
  'Arial',
  'Arial Black',
  'Georgia',
  'Impact',
  'Tahoma',
  'Times New Roman',
  'Verdana',
  'Courier New',
  'Lucida Console',
  'Monaco',
  'monospace',
];

/** Default font size list */
export const DEFAULT_FONT_SIZE_LIST = [
  '10px',
  '11px',
  '12px',
  '14px',
  '16px',
  '18px',
  '20px',
  '22px',
  '24px',
  '26px',
  '28px',
  '36px',
  '48px',
  '72px',
] as const;

/** Default font size value */
export const DEFAULT_FONT_SIZE_VALUE = 'default';

/** Options for setting image size in the bubble menu */
export enum IMAGE_SIZE {
  'size-small' = 200,
  'size-medium' = 500,
  'size-large' = '100%',
}

/** Options for setting video size in the bubble menu */
export enum VIDEO_SIZE {
  'size-small' = 480,
  'size-medium' = 640,
  'size-large' = '100%',
}

/** Line Height List */
export const DEFAULT_LINE_HEIGHT_LIST = ['100%', '115%', '150%', '200%', '250%', '300%'];
export const LINE_HEIGHT_100 = 1.7;
export const DEFAULT_LINE_HEIGHT = '1';

/** display in menus */
export const NODE_TYPE_MENU: any = {
  image: [
    'divider',
    'image-size-small',
    'image-size-medium',
    'image-size-large',
    'divider',
    'image-left',
    'image-center',
    'image-right',
    'divider',
    'image-aspect-ratio',
    'remove',
  ],
  text: [
    'divider',
    'text-bubble',
    'divider',
    'bold',
    'italic',
    'underline',
    'strike',
    'code',
    'link',
    'divider',
    'color',
    'highlight',
    'textAlign',
  ],
  video: ['video-size-small', 'video-size-medium', 'video-size-large', 'divider', 'remove'],
  table: ['removeTable'],
};

/** display in bubble text menu */
export const BUBBLE_TEXT_LIST = [
  'bold',
  'italic',
  'underline',
  'strike',
  'code',
  'link',
  'divider',
  'color',
  'highlight',
  'textAlign',
];
