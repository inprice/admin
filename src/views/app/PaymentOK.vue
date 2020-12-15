<template>
  <div class="pa-5">
    <h1 class="h2 green--text text-center mb-4">
      <v-icon large color="green">mdi-check-circle-outline</v-icon> Payment Successful!
    </h1>

    <h3 class="mb-2 text-center">Thank you! Your payment has been processed successfully.</h3>

    <v-card class="pa-5 mt-10">
      <div class="pb-3 font-weight-medium">
        <v-icon left>mdi-bullhorn-outline</v-icon>
        Your plan details
      </div>

      <v-divider class="py-2"></v-divider>

      <v-simple-table class="property-table">
        <template v-slot:default>
          <tbody>
            <tr>
              <td class="prop-name">Status</td>
              <td><v-text-field solo dense readonly hide-details="true" class="col-4" v-model="CURSTAT.status" /></td>
            </tr>
            <tr>
              <td class="prop-name">Plan Name</td>
              <td><v-text-field solo dense readonly hide-details="true" class="col-4" :value="CURSTAT.planName || 'Not selected!'" /></td>
            </tr>
            <tr>
              <td class="prop-name text-capitalize">Renewal At</td>
              <td class="d-flex">
                <v-text-field solo dense readonly hide-details="true" class="col-4" v-model="CURSTAT.renewalAt" />
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
    
    <v-card class="pa-5 mt-5">
      <div class="pb-3 font-weight-medium">
        <v-icon left>mdi-alert-circle-outline</v-icon>
        Please note that sometimes payment process takes time to show up.
      </div>

      <v-divider class="py-2"></v-divider>

      <div class="mb-2">
        If you don't see any update in your session after two hours, please do the following in order
      </div>

      <ul>
        <li>Click 'Refresh Session' button on Subscription page.</li>
        <li>Log out and in.</li>
        <li>Inform us by sending an email to <strong>support@inprice.io</strong></li>
      </ul>
    </v-card>

    <div class="text-center">
      <v-btn
        class="mt-10"
        color="primary"
        outlined
        @click="gotoProductsPage"
      >
        Go to products page
      </v-btn>
    </div>
  </div>
</template>

<script>
import { get } from 'vuex-pathify'

export default {
  computed: {
    CURSTAT: get('auth/CURRENT_STATUS'),
  },
  methods: {
    gotoProductsPage() {
      this.$store.dispatch('auth/refreshSession');
      this.$router.push({ name: 'products' });
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$store.dispatch('auth/refreshSession');
    });
  }
}
</script>
