<template>
  <v-dialog 
    v-model="show" 
    overlay-opacity="0.3"
    content-class="rounded-dialog"
  >
    <v-card>
      <v-card-title class="pb-0 d-flex justify-space-between">
        <div>
          <div>Last confirmation</div>
          <div class="caption">
            To continue, please enter your password for the last time
          </div>
        </div>
        <v-btn icon @click="close" class="my-auto"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>

      <v-card-text class="py-0 mt-5">
        <v-form ref="form" v-model="valid" @submit.prevent>
          <v-text-field
            outlined dense
            label="Password"
            v-model="form.password"
            :rules="rules.password"
            type="text"
            maxlength="16"
            class="password-wo-help"
            autocomplete="new-password"
            @keyup.native.enter="valid && submit()"
          />
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="justify-end pa-3">
        <v-btn
          text
          color="error"
          @click="submit"
          :loading="loading" 
          :disabled="loading"
        >
          Delete
        </v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      loading: false,
      valid: false,
      rules: {},
      form: {
        password: '',
      },
    };
  },
  methods: {
    async submit() {
      this.activateRules();
      await this.$refs.form.validate();
      if (this.valid) {
        this.loading = true;
        this.$emit('confirmed', this.form.password);
      }
    },
    activateRules() {
      this.rules = {
        password: [
          v => !!v || "Required",
          v => (v && v.length >= 6 && v.length <= 16) || "Password must be between 6-16 chars",
        ],
      }
    },
    open() {
      this.show = true;
      this.form.password = null;
      this.$nextTick(() => this.$refs.form.resetValidation());
    },
    stopLoading() {
      this.loading = false;
    },
    close() {
      this.$refs.form.resetValidation();
      this.show = false;
      this.loading = false;
    }
  }
};
</script>
