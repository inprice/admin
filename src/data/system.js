const system = {
  ROW_LIMIT_FOR_LISTS: 25
};

const keys = {
  SESSIONS: 'INPRICE_CS',
  SESSION_NO: 'Session'
};

const POSITIONS = [
  { value: 1, text: 'Lowest' },
  { value: 2, text: 'Lower' },
  { value: 3, text: 'Average' },
  { value: 4, text: 'Higher' },
  { value: 5, text: 'Highest' }
];

const STATUSES = [
  { value: null, text: 'ALL' },
  { value: 'AVAILABLE', text: 'AVAILABLE' },
  { value: 'TOBE_CLASSIFIED', text: 'TOBE CLASSIFIED' },
  { value: 'TOBE_RENEWED', text: 'TOBE RENEWED' },
  { value: 'TOBE_IMPLEMENTED', text: 'TOBE IMPLEMENTED' },
  { value: 'IMPLEMENTED', text: 'IMPLEMENTED' },
  { value: 'DUPLICATE', text: 'DUPLICATE' },
  { value: 'WONT_BE_IMPLEMENTED', text: 'WONT BE IMPLEMENTED' },
  { value: 'IMPROPER', text: 'IMPROPER' },
  { value: 'NOT_A_PRODUCT_PAGE', text: 'NOT A PRODUCT PAGE' },
  { value: 'NO_DATA', text: 'NO DATA' },
  { value: 'NOT_AVAILABLE', text: 'NOT AVAILABLE' },
  { value: 'READ_ERROR', text: 'READ ERROR' },
  { value: 'SOCKET_ERROR', text: 'SOCKET ERROR' },
  { value: 'NETWORK_ERROR', text: 'NETWORK ERROR' },
  { value: 'CLASS_PROBLEM', text: 'CLASS PROBLEM' },
  { value: 'INTERNAL_ERROR', text: 'INTERNAL ERROR' },
  { value: 'PAUSED', text: 'PAUSED' },
  { value: 'RESUMED', text: 'RESUMED' },
];

const IMPORT_STATUSES = [
  { value: null, text: 'ALL' },
  { value: 'TOBE_CLASSIFIED', text: 'TOBE CLASSIFIED' },
  { value: 'AVAILABLE', text: 'AVAILABLE' },
  { value: 'DUPLICATE', text: 'DUPLICATE' },
  { value: 'NOT_AVAILABLE', text: 'NOT AVAILABLE' },
  { value: 'NOT_A_PRODUCT_PAGE', text: 'NOT A PRODUCT PAGE' }
];

export default {
  system,
  keys,
  POSITIONS,
  STATUSES,
  IMPORT_STATUSES,
}