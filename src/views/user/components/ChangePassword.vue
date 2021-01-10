<template>
  <v-row justify="center">

    <v-dialog 
      v-model="opened" 
      :max-width="findDialogWidth"
      overlay-opacity="0.2">
      <v-card>
        <v-card-title>Change password</v-card-title>
        <v-card-subtitle class="pb-2">for {{ title }}</v-card-subtitle>

        <v-divider></v-divider>

        <v-card-text class="pt-2 pb-0">

          <v-form ref="form" v-model="valid" @submit.prevent>
            <v-text-field
              autofocus
              label="Old Password"
              v-model="form.oldPassword"
              :rules="rules.oldPassword"
              type="text"
              maxlength="16"
              class="password-wo-help"
              autocomplete="new-password"
              @keyup.native.enter="valid && submit()"
            />

            <v-text-field
              label="New Password"
              v-model="form.password"
              :rules="rules.password"
              :append-icon="showPass.new ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPass.new ? 'text' : 'password'"
              @click:append="showPass.new = !showPass.new"
              maxlength="16"
              @keyup.native.enter="valid && submit()"
            />

            <v-text-field
              label="Repeat Password"
              v-model="form.repeatPassword"
              :rules="rules.repeatPassword"
              :append-icon="showPass.repeat ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPass.repeat ? 'text' : 'password'"
              @click:append="showPass.repeat = !showPass.repeat"
              maxlength="16"
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
            Save
          </v-btn>

        </v-card-actions>

      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import UserService from '@/service/user';
import Utility from '@/helpers/utility';

export default {
  computed: {
    findDialogWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '80%';
        case 'sm': return '50%';
        case 'md': return '35%';
        case 'lg': return '27%';
        default: return '20%';
      }
    },
  },
  data() {
    return {
      title: 'User name',
      opened: false,
      loading: false,
      valid: false,
      showPass: {
        new: false,
        repeat: false
      },
      rules: {},
      form: {
        oldPassword: '',
        password: '',
        repeatPassword: ''
      }
    };
  },
  methods: {
    async submit() {
      if (Object.keys(this.rules).length == 0) this.activateRules();
      await this.$refs.form.validate();
      if (this.valid) {
        this.loading = true;
        const result = await UserService.changePassword(this.form);
        if (result == true) {
          this.close();
          return;
        }
        this.loading = false;
      }
    },
    open(title) {
      this.title = title;
      this.opened = true;
      let self = this;
      this.$nextTick(() => {
        self.$refs.form.resetValidation();
        Utility.removeTabIndexFromIconButtons(self.$el);
      });
    },
    close() {
      this.opened = false;
      this.loading = false;
      this.$refs.form.resetValidation();
    },
    activateRules() {
      this.rules = {
        oldPassword: [
          v => !!v || "Old password required",
          v => (v && v.length >= 4 && v.length <= 16) || "Old password must be between 4-16 chars",
        ],
        password: [
          v => !!v || "New password required",
          v => (v && v.length >= 4 && v.length <= 16) || "New password must be between 4-16 chars",
          v => (v && v != this.form.oldPassword) || "Old and New passwords must be different",
        ],
        repeatPassword: [
          v => !!v || "Repeat Password required",
          v => (v && v.length >= 4 && v.length <= 16) || "Repeat password must be between 4-16 chars",
          v => (v && v == this.form.password) || "Passwords must be the same"
        ],
      }
    },
  }
};
</script>
