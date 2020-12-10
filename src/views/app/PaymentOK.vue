<template>
  <v-row align="center" class="text-center">
    <v-col>
      <h1 class="h2 green--text mb-4">
        <v-icon large color="green">mdi-check-circle-outline</v-icon> Payment Successful!
      </h1>

      <h3 class="mb-8">Thank you! Your payment has been processed successfully.</h3>
      
      <div><strong>Please note that</strong> sometimes payment process takes time to show up in your account.</div>
      <div>If you don't see any changes after two hours, please contact us with an email <strong>support@inprice.io</strong></div>

      <v-btn
        class="mt-10"
        color="primary"
        outlined
        :to="{ name: 'products' }"
      >
        Turn to dashboard
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  mounted() {
    this.$store.dispatch('auth/refreshSession');
  }

}
</script>
