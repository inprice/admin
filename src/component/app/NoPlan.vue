<template>
  <div>
    <span class="headline">Ooops!</span>

    <div v-if="$store.get('auth/IS_ADMIN')">
      <p>
        Seems that you have not choose a plan yet. Before proceed further you need buy a plan.
      </p>
      
      <span class="headline">Or</span>
      
      <p>
        You can apply a coupon code (if you have any)
        <v-btn @click="openDialog">Use coupon</v-btn>
        <apply-coupon ref="dialog" @applied="applied"/>
      </p>
    </div>
    <div v-else>
      <p>
        In order to define your products, you need to select a plan.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    openDialog() {
      this.$refs.dialog.open();
    },
    applied() {
      this.$emit('applied');
    }
  },
  components: {
    ApplyCoupon: () => import('./ApplyCoupon.vue'),
  }
}
</script>
