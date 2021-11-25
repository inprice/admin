<template>
  <div class="pa-5">
    <h1 class="h2 blue--text text-center mb-4">
      <v-icon large color="blue">mdi-close-circle-outline</v-icon> Checkout Cancelled!
    </h1>

    <h3 class="mb-2 text-center">You cancelled your checkout!</h3>
    
    <v-card class="pa-5 mt-10">
      <div class="pb-3 font-weight-medium">
        <v-icon left>mdi-alert-circle-outline</v-icon>
        Please keep in mind
      </div>

      <v-divider class="py-2"></v-divider>

      <div class="mb-2">
        <div> - Since the checkout avoided, no action will be taken about this.</div>
        <div> - You can subscribe a new plan whenever you want.</div>
        <div> - If you have a problem, please contact us with an email <strong>support@inprice.io</strong></div>
      </div>

    </v-card>

    <div class="text-center">
      <v-btn
        class="mt-10"
        color="primary"
        :to="{ name: 'workspace-settings' }"
      >
        Turn to settings
      </v-btn>
    </div>
  </div>
</template>

<script>
import SubsService from '@/service/subscription';

export default {
  mounted() {
    const hash = this.$route.params.hash;
    if (hash) {
      SubsService.cancelCheckout(hash);
    }
  }
}
</script>
