<template>
  <div class="pa-5">
    <h1 class="h2 green--text text-center mb-4">
      <v-icon large color="green">mdi-check-circle-outline</v-icon> Payment Successful!
    </h1>

    <h3 class="mb-2 text-center">Thank you! Your payment has been processed successfully.</h3>

    <v-card class="pa-5 mt-10" v-if="CURSTAT.status == 'SUBSCRIBED'">
      <div class="pb-3 font-weight-medium">
        <v-icon left>mdi-bullhorn-outline</v-icon>
        Your plan details
      </div>

      <v-divider class="py-2"></v-divider>

      <v-simple-table class="property-table">
        <template v-slot:default>
          <tbody>
            <property valueClass="col-4" name="Status" :value="CURSTAT.status" />
            <property valueClass="col-4" name="Plan Name" :value="CURSTAT.planName || 'Not selected!'" />
            <property valueClass="col-4" name="Renewal At" :value="CURSTAT.renewalAt" />
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
    
    <v-card class="pa-5 mt-5" v-else>
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
        @click="$router.push({ name: 'groups' })"
      >
        Go to groups page
      </v-btn>
    </div>

    <overlay :show="overlay" />

  </div>
</template>

<script>
import { get } from 'vuex-pathify'

export default {
  computed: {
    CURSTAT: get('session/getCurrentStatus'),
  },
  data() {
    return {
      overlay: false,
    };
  },
  mounted() {
    let retry = 0;
    this.overlay = true;
    const refreshId = setInterval(() => {
      this.$store.dispatch('session/refresh'); 
      if (this.CURSTAT.status == 'SUBSCRIBED' || retry >= 5) {
        clearInterval(refreshId);
        this.overlay = false;
      }
      retry++;
    }, 1000);
  },
  components: {
    Overlay: () => import('@/component/app/Overlay.vue'),
    Property: () => import('@/component/app/Property.vue')
  }
}
</script>
