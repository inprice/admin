<template>
  <div>
      <span v-if="daysToRenewal < 0">
        Your 30 days free trial period has ended <ago class="d-inline font-weight-bold" :date="subsRenewalAt" />.
      </span>
      <span v-if="daysToRenewal == 0">
        Your 30 days free trial period will be ending <strong>today</strong>.
      </span>
      <span v-if="daysToRenewal > 0">
        You've started your 30 days free trial period, and it will be ending in <strong>{{ daysToRenewal }} days</strong>.
      </span>
  </div>
</template>

<script>
export default {
  props: {
    daysToRenewal: Number,
    subsRenewalAt: String
  }
}
</script>
