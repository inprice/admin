const KEYS = {
  SESSIONS: 'INPRICE_CS',
  SESSION_NO: 'Session'
};

const ROW_LIMITS = [25, 50, 100];

const LIMITS = {
  DAYS_FOR_FREE_USE: 14,
  ROW_LIMIT_FOR_LISTS: ROW_LIMITS[0],
};

const BOOLEANS = [
  { text: 'All', value: 'ALL' },
  { text: 'True', value: 'TRUE' },
  { text: 'False', value: 'FALSE' },
];

const REPORT_UNITS = [
  { text: 'Pdf', value: 'Pdf' },
  { text: 'Csv', value: 'Csv' },
  { text: 'Excel', value: 'Excel' },
];

const POSITIONS = [
  { text: 'Lowest', value: 'Lowest' }, 
  { text: 'Highest', value: 'Highest' }, 
  { text: 'Lower', value: 'Lower' },
  { text: 'Average', value: 'Average' },
  { text: 'Higher', value: 'Higher' },
  { text: 'Equal', value: 'Equal' },
  { text: 'Not Set', value: 'NotSet' }
];

const LINK_STATUSES = [
  { text: 'Active', value: 'ACTIVE' },
  { text: 'Waiting', value: 'WAITING' },
  { text: 'Trying', value: 'TRYING' },
  { text: 'Problem', value: 'PROBLEM' }
];

const ORDERING = [
  { text: 'Ascending', value: 'ASC' },
  { text: 'Descending', value: 'DESC' }
];

const ALARM_STATES = [
  { text: 'All', value: 'ALL' },
  { text: 'Alarmed', value: 'ALARMED' },
  { text: 'Not alarmed', value: 'NOT_ALARMED' }
];

const ALARM_LEVELS = [
  { text: 'Info', value: 'INFO' },
  { text: 'Warning', value: 'WARNING' }
];

const ALARM_TYPES = [
  { text: 'User', value: 'USER' },
  { text: 'Workspace', value: 'WORKSPACE' },
  { text: 'System', value: 'SYSTEM' }
];

const TICKET_TYPES = [
  { text: 'Feedback', secondary: 'Report a problem', value: 'FEEDBACK' },
  { text: 'Support', secondary: 'Ask support', value: 'SUPPORT' },
  { text: 'Problem', secondary: 'Give feedback', value: 'PROBLEM' }
];

const TICKET_STATUSES = [
  { text: 'Opened', value: 'OPENED' },
  { text: 'In progress', value: 'IN_PROGRESS' },
  { text: 'Waiting for user', value: 'WAITING_FOR_USER' },
  { text: 'Waiting for version', value: 'WAITING_FOR_VERSION' },
  { text: 'Closed', value: 'CLOSED' }
];

const TICKET_PRIORITIES = [
  { text: 'Low', value: 'LOW' },
  { text: 'Normal', value: 'NORMAL' },
  { text: 'High', value: 'HIGH' },
  { text: 'Critical', value: 'CRITICAL' }
];

const TICKET_SUBJECTS = [
  { text: 'Subscription', value: 'SUBSCRIPTION' },
  { text: 'Payment', value: 'PAYMENT' },
  { text: 'Link', value: 'LINK' },
  { text: 'Product', value: 'PRODUCT' },
  { text: 'Workspace', value: 'WORKSPACE' },
  { text: 'Voucher', value: 'VOUCHER' },
  { text: 'Other', value: 'OTHER' }
];

const SEEN_STATES = [
  { text: 'All', value: 'ALL' },
  { text: 'Seen', value: 'SEEN' },
  { text: 'Not seen', value: 'NOT_SEEN' }
];

export default {
  KEYS,
  LIMITS,
  BOOLEANS,
  ROW_LIMITS,
  REPORT_UNITS,
 
  POSITIONS,
  ORDERING,
  LINK_STATUSES,

  ALARM_STATES,
  ALARM_LEVELS,
  ALARM_TYPES,

  TICKET_TYPES,
  TICKET_STATUSES,
  TICKET_PRIORITIES,
  TICKET_SUBJECTS,
  SEEN_STATES,
}