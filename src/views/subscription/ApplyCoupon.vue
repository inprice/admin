<template>
  <v-card class="mt-5">
    <v-card-title>
      <v-icon class="mr-4">mdi-ticket-confirmation-outline</v-icon>
      <div>
        <div>Use coupon</div>
        <div class="caption">If you have a valid coupon code, you can enter here to use it.</div>
      </div>
    </v-card-title>

    <v-divider></v-divider>

    <v-form ref="form" v-model="valid" @submit.prevent class="d-flex mt-7 ml-4">
      <v-text-field
        outlined
        dense
        class="col-3 mr-3"
        label="Coupon Code"
        v-model="form.code"
        :rules="rules.code"
        maxlength="8"
        @keyup.native.enter="valid && submit()"
      />
      <v-btn
        @click="submit"
        color="primary"
        :loading="loading" 
        :disabled="loading"
      >
        Apply
      </v-btn>
    </v-form>

  </v-card>

</template>

<script>
import CompanyService from '@/service/company';

export default {
  data() {
    return {
      loading: false,
      valid: false,
      rules: {},
      form: {
        code: ''
      }
    }
  },
  methods: {
    async submit() {
      if (Object.keys(this.rules).length == 0) this.activateRules();
      await this.$refs.form.validate();
      if (this.valid) {
        this.loading = true;
        const result = await CompanyService.applyCoupon(this.form.code);
        if (result && result.status == true) {
          this.$store.set('auth/SUBSCRIPTION', result.data);
          this.$emit('applied', result.data);
        }
        this.loading = false;
      }
    },
    activateRules() {
      this.rules = {
        code: [
          v => !!v || "Code is required",
          v => (v.length == 8) || "Coupon code must be 8 chars",
        ],
      }
    },
  },
};
</script>
