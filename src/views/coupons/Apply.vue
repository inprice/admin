<template>
  <v-row justify="center">

    <v-dialog 
      v-model="opened" 
      :max-width="findDialogWidth"
      @keydown.esc="close"
      overlay-opacity="0.2"
    >
      <v-card>

        <div class="d-flex justify-space-between pa-4 pb-1">
          <div>
            <div class="title">Apply coupon</div>
            <div class="caption pb-2">Please enter your coupon code below</div>
          </div>
          <v-btn icon @click="close" class="my-auto"><v-icon>mdi-close</v-icon></v-btn>
        </div>

        <v-divider></v-divider>

        <v-card-text class="py-2">
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

        <v-divider></v-divider>

        <v-card-actions class="py-3 justify-end">
          <v-btn 
            tabindex="-1"
            @click="close"
          >
            Close
          </v-btn>
          <v-btn
            text outlined
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
  </v-row>
</template>

<script>
import CouponService from '@/service/coupon';

export default {
  computed: {
    findDialogWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '80%';
        case 'sm': return '50%';
        case 'md': return '35%';
        case 'lg': return '27%';
        default: return '18%';
      }
    },
  },
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
