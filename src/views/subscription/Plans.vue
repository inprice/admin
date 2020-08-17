<template>
  <v-card class="mt-5">
    <v-card-title>
      <v-icon class="mr-4">mdi-format-list-checks</v-icon>
      <div>
        <div>Plans</div>
        <div class="caption">You can select a plan from the followings to start monitoring.</div>
      </div>
    </v-card-title>

    <v-divider></v-divider>

    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th width="15%">Name</th>
            <th>Description</th>
            <th width="10%" class="text-right">Price *</th>
            <th width="5%" class="text-center"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.name }}</td>
            <td>{{ row.description }}</td>
            <td class="text-right title">{{ '€' + row.price.toFixed(2) }}</td>
            <td class="text-center">
              <v-btn 
                small
                color="success"
                class="mx-2"
                @click="subscribe(row.id)"
              >
                Subscribe
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <v-divider></v-divider>

    <div class="caption pa-4"><strong>* Please Note that: </strong> Prices in this table are monthly basis and in Euro currency!</div>

  </v-card>

</template>

<script>
import SubsService from '@/service/subscription';
import Utility from '@/helpers/utility';
import { get } from 'vuex-pathify'

const stripe = window.Stripe(process.env.VUE_APP_STRIPE_PK);

export default {
  props: ['rows', 'status'],
  computed: {
    session: get('auth/session'),
  },
  methods: {
    async subscribe(planId) {
      const result = await SubsService.createSession(planId);
      if (result.status == true) {
        stripe.redirectToCheckout({
          sessionId: result.data.sessionId
        }).then(function (result) {
          if (result.error && result.error.message) {
            Utility.showErrorMessage('Subscription', 'payment', { reason: result.error.message });
          } else {
            console.log('Calling result of stripes checkout form', result);
          }
        });
      }
    },
  },
};
</script>
