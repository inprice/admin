<template>
  <v-dialog 
    v-model="show"
    overlay-opacity="0.3"
    content-class="rounded-dialog"
  >
    <v-card>
      <v-card-title class="pb-0 d-flex justify-space-between">
        <span>Apply voucher</span>
        <v-btn icon @click="close" class="my-auto"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>

      <v-card-text class="py-0 mt-3">
        <v-form ref="form" v-model="valid">
          <v-text-field
            dense
            outlined
            label="Code"
            v-model="form.code"
            :rules="rules.code"
            maxlength="8"
            @keyup.native.enter="valid && submit()"
          />
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="justify-end pa-3">
        <v-btn
          text
          @click="submit"
          color="primary"
          :loading="loading"
          :disabled="loading || $store.get('session/isNotEditor')"
        >
          Apply
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import VoucherService from '@/service/voucher';

export default {
  data() {
    return {
      show: false,
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
        const result = await VoucherService.applyVoucher(this.form.code);
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
      this.show = true;
      this.$nextTick(() => this.$refs.form.resetValidation());
    },
    close() {
      this.show = false;
      this.loading = false;
      this.$refs.form.resetValidation();
    }
  }
};
</script>
