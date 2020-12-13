import Vue from 'vue'

const ACTIVE_COMPANY_STATUSES = [
  'FREE',
  'COUPONED',
  'SUBSCRIBED'
];

Vue.mixin({
  methods: {
    hasCompanyActiveStatus(status, daysToRenewal) {
      return status && daysToRenewal && ACTIVE_COMPANY_STATUSES.includes(status);
    }    
  }
});