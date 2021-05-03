const LIMITS = {
  DAYS_FOR_FREE_USE: 14,
  ROW_LIMIT_FOR_LISTS: 25,
};

const KEYS = {
  SESSIONS: 'INPRICE_CS',
  SESSION_NO: 'Session'
};

const POSITIONS = [
  { value: 1, text: 'LOWEST' },
  { value: 2, text: 'LOWER' },
  { value: 3, text: 'AVERAGE' },
  { value: 4, text: 'HIGHER' },
  { value: 5, text: 'HIGHEST' },
  { value: 6, text: 'EQUAL' },
  { value: 7, text: 'NA' },
];

const POSITION_NAMES = POSITIONS.map(pos =>  pos.text);

export default {
  LIMITS,
  KEYS,
  POSITIONS,
  POSITION_NAMES,
}