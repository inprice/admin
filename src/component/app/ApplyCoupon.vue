<template>
  <v-row justify="center">

    <v-dialog v-model="opened" max-width="350" overlay-opacity="0.2">
      <v-card>
        <v-card-title>Apply a coupon code</v-card-title>
        <v-card-subtitle>Please enter your coupon code below</v-card-subtitle>

        <v-divider></v-divider>

        <v-card-text class="mt-5">
          <v-form ref="form" v-model="valid" @submit.prevent>
            <v-text-field
              ref="code"
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

          <v-btn small @click="close">Close</v-btn>
          <v-btn
            small
            @click="submit"
            color="primary"
            :loading="loading" 
            :disabled="loading"
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
import Utility from '@/helpers/utility';

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
      let self = this;
      Utility.doubleRaf(() => {
        self.$refs.form.resetValidation();
        self.$refs.code.focus();
      });
    },
    close() {
      this.opened = false;
      this.loading = false;
      this.$refs.form.resetValidation();
    }
  }
};
</script>
