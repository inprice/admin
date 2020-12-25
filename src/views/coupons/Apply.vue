<template>
  <v-row justify="center">

    <v-dialog v-model="opened" max-width="350" overlay-opacity="0.2">
      <v-card>
        <v-card-title>Apply a coupon code</v-card-title>
        <v-card-subtitle class="pb-2">Please enter your coupon code below</v-card-subtitle>

        <v-divider></v-divider>

        <v-card-text class="pt-2 pb-0">
          <v-form ref="form" v-model="valid" @submit.prevent>
            <v-text-field
              autofocus
              label="Coupon Code"
              v-model="form.code"
              :rules="rules.code"
              maxlength="8"
              @keyup.native.enter="valid && submit()"
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn @click="close">Close</v-btn>
          <v-btn
            @click="submit"
            color="primary"
            :loading="loading"
            :disabled="loading || $store.get('session/isViewer')"
          >
            Apply
          </v-btn>

        </v-card-actions>

      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import CouponService from '@/service/coupon';

export default {
  data() {
    return {
      opened: false,
      loading: false,
      valid: false,
      rules: {},
      form: {
        code: ''
      }
    };
  },
  methods: {
    async submit() {
      if (Object.keys(this.rules).length == 0) this.activateRules();
      await this.$refs.form.validate();
      if (this.valid) {
        this.loading = true;
        const result = await CouponService.applyCoupon(this.form.code);
        if (result && result.status == true) {
          this.$emit('applied', result.data);
          this.close();
        }
        this.loading = false;
      }
    },
    activateRules() {
      this.rules = {
        code: [
          v => !!v || "Required",
          v => (v.length == 8) || "Must be 8 chars",
        ],
      }
    },
    open() {
      this.opened = true;
      this.$nextTick(() => this.$refs.form.resetValidation());
    },
    close() {
      this.opened = false;
      this.loading = false;
      this.$refs.form.resetValidation();
    }
  }
};
</script>
