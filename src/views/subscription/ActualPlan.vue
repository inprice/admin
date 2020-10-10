<template>
  <div>
    <v-simple-table class="property-table pt-3 pb-1" v-if="status == 'ACTIVE' || status == 'COUPONED'">
      <template v-slot:default>
        <tbody>
          <tr>
            <td class="prop-name">Name</td>
            <td><v-text-field solo dense readonly hide-details="true" class="col-4" v-model="data.name" /></td>
          </tr>
          <tr>
            <td class="prop-name">Status</td>
            <td><v-text-field solo dense readonly hide-details="true" class="col-4" v-model="data.status" /></td>
          </tr>
          <tr>
            <td class="prop-name">Renewal Date</td>
            <td><v-text-field solo dense readonly hide-details="true" class="col-4" v-model="data.renewalTime" /></td>
          </tr>
          <tr>
            <td class="prop-name">Description</td>
            <td><v-text-field solo dense readonly hide-details="true" v-model="data.description" /></td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <div class="d-flex pa-4" v-else>
      <div>You have <strong>no actual plan</strong> at the moment. Please pick a plan from the following table</div>
      <v-spacer></v-spacer>
      <v-btn 
        small
        color="success"
        @click="openApplyCouponDialog">
          or Apply a coupon
      </v-btn>
    </div>

    <apply-coupon ref="applyCouponDialog" @applied="applyCoupon" />
  </div>

</template>

<script>
export default {
  props: ['data', 'status'],
  methods: {
    cancel() {
      this.$emit('cancel');
    },
    applyCoupon(data) {
      this.$emit('applied', data);
    },
    openApplyCouponDialog() {
      this.$refs.applyCouponDialog.open();
    },
  },
  components: {
    ApplyCoupon: () => import('@/component/app/ApplyCoupon.vue')
  }
};
</script>
