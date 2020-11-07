<template>
  <v-row justify="center">

    <v-dialog v-model="opened" max-width="350" overlay-opacity="0.2">
      <v-card>
        <v-card-title>Please enter your password</v-card-title>
        <v-divider></v-divider>

        <v-card-text class="mt-5">
          <v-form ref="form" v-model="valid">
            <v-text-field
              autofocus
              label="Password"
              v-model="form.password"
              :rules="rules.password"
              :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPass ? 'text' : 'password'"
              @click:append="showPass = !showPass"
              maxlength="16"
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
            Confirm
          </v-btn>
        </v-card-actions>

      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      showPass: false,
      opened: false,
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
          v => (v.length >= 4 && v.length <= 16) || "Password must be between 4-16 chars",
        ],
      }
    },
    open() {
      this.opened = true;
      this.$nextTick(() => this.$refs.form.resetValidation());
    },
    stopLoading() {
      this.loading = false;
    },
    close() {
      this.$refs.form.resetValidation();
      this.opened = false;
      this.loading = false;
    }
  }
};
</script>
