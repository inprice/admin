<template>
  <v-card class="mt-5">
    <v-card-title>
      <v-icon class="mr-4">mdi-format-list-checks</v-icon>
      <div>
        <div>Plans</div>
        <div class="caption">
          <span v-if="status == 'NOT_SET'">
            You have no active plan at the moment. Please pick one to start monitoring.
          </span>
          <span v-if="status == 'COUPONED'">
            You can select a plan from the followings to start monitoring.
          </span>
        </div>
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
            <td class="text-right font-weight-bold">{{ '€' + row.price.toFixed(2) }}</td>
            <td class="text-center">
              <v-btn 
                small
                color="success"
                class="mx-2"
                @click="subscribe(row.stripePriceId)"
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
import { get } from 'vuex-pathify'

const stripe = window.Stripe(process.env.VUE_APP_STRIPE_PK);

export default {
  props: ['rows', 'status'],
  computed: {
    session: get('auth/session'),
  },
  methods: {
    subscribe(priceId) {
      try {
        const options = {
          //clientReferenceId: this.stripeCustomerId,
          clientReferenceId: 'cus_Hi6wFFgiicY8I4',
          customerEmail: this.session.email,
          successUrl: window.location.href,
          cancelUrl: window.location.href,
          mode: 'subscription',
          items: [{ plan: priceId, quantity: 1 }],
        };

        stripe.redirectToCheckout(options);
      } catch (e) {
        console.error(e);
        this.$emit('error', e);
      } finally {
        this.$emit('loading', false);
      }
    }
  },
};
</script>
