<template>
  <div>
    <p>
      Seems that you have not choose a plan yet. Before proceed further you need buy a plan.
    </p>
    Or
    <div>
      You can apply a coupon code (if you have any)
      <v-btn @click="openDialog">Use coupon</v-btn>
      <apply-coupon ref="dialog" @applied="applied"/>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    openDialog() {
      this.$refs.dialog.open();
    },
    applied(data) {
      this.$emit('applied', data);
    }
  },
  components: {
    ApplyCoupon: () => import('./ApplyCoupon.vue'),
  }
}
</script>
