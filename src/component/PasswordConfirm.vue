<template>
  <v-row justify="center">

    <v-dialog 
      v-model="opened" 
      :max-width="findDialogWidth"
      @keydown.esc="close"
      overlay-opacity="0.2">
      <v-card>
        <div class="d-flex justify-space-between pa-3">
          <div>
            <div class="title">Last confirmation</div>
            <div class="caption">
              Please enter your password to continue
            </div>
          </div>
          <v-btn icon class="my-auto" @click="close"><v-icon>mdi-close</v-icon></v-btn>
        </div>

        <v-divider></v-divider>

        <v-card-text class="pt-2 pb-0">

          <v-form ref="form" v-model="valid" @submit.prevent>
            <v-text-field
              autofocus
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

        <v-card-actions class="justify-end py-3">
          <v-btn
            text
            tabindex="-1"
            @click="close"
          >
            Close
          </v-btn>
          <v-btn
            text
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
  computed: {
    findDialogWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '80%';
        case 'sm': return '50%';
        case 'md': return '35%';
        case 'lg': return '27%';
        default: return '18%';
      }
    }
  },
  data() {
    return {
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
          v => (v && v.length >= 4 && v.length <= 16) || "Password must be between 4-16 chars",
        ],
      }
    },
    open() {
      this.opened = true;
      this.form.password = null;
      this.$nextTick(() => {
        this.$refs.form.resetValidation()
      });
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
