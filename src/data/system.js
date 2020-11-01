const system = {
  ROW_LIMIT_FOR_LISTS: 25,
  TAG_COLORS: ['orange', 'cyan', 'indigo', 'teal', 'green', 'purple']
};

const keys = {
  SESSIONS: 'INPRICE_CS',
  SESSION_NO: 'Session'
};

const POSITIONS = [
  { value: 1, text: 'LOWEST' },
  { value: 2, text: 'LOWER' },
  { value: 3, text: 'AVERAGE' },
  { value: 4, text: 'HIGHER' },
  { value: 5, text: 'HIGHEST' }
];

const POSITION_NAMES = POSITIONS.map(pos =>  pos.text);

const STATUSES = [
  { value: null, text: 'ALL' },
  { value: 'AVAILABLE', text: 'AVAILABLE' },
  { value: 'TOBE_CLASSIFIED', text: 'TOBE CLASSIFIED' },
  { value: 'TOBE_IMPLEMENTED', text: 'TOBE IMPLEMENTED' },
  { value: 'RESOLVED', text: 'RESOLVED' },
  { value: 'PAUSED', text: 'PAUSED' },
  { value: 'RESUMED', text: 'RESUMED' },
  { value: 'NOT_AVAILABLE', text: 'NOT AVAILABLE' },
  { value: 'DUPLICATE', text: 'DUPLICATE' },
  { value: 'IMPROPER', text: 'IMPROPER' },
  { value: 'NO_DATA', text: 'NO DATA' },
  { value: 'NETWORK_ERROR', text: 'NETWORK ERROR' },
  { value: 'CLASS_PROBLEM', text: 'CLASS PROBLEM' },
  { value: 'INTERNAL_ERROR', text: 'INTERNAL ERROR' },
];

const IMPORT_STATUSES = [
  { value: null, text: 'ALL' },
  { value: 'TOBE_CLASSIFIED', text: 'TOBE CLASSIFIED' },
  { value: 'AVAILABLE', text: 'AVAILABLE' },
  { value: 'DUPLICATE', text: 'DUPLICATE' },
  { value: 'NOT_AVAILABLE', text: 'NOT AVAILABLE' },
  { value: 'IMPROPER', text: 'IMPROPER' },
  { value: 'NO_DATA', text: 'NO DATA' }
];

export default {
  system,
  keys,
  POSITIONS,
  POSITION_NAMES,
  STATUSES,
  IMPORT_STATUSES,
}