<template>
  <v-row justify="center">

    <v-dialog v-model="opened" max-width="350">
      <v-card>
        <v-card-title>Change password</v-card-title>
        <v-card-subtitle>{{ title }}</v-card-subtitle>

        <v-card-text class="mt-5">

          <v-form ref="form" v-model="valid">
            <v-text-field
              ref="oldPassword"
              label="Old Password"
              v-model="form.oldPassword"
              :rules="rules.oldPassword"
              :append-icon="showPass1 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPass1 ? 'text' : 'password'"
              @click:append="showPass1 = !showPass1"
            />

            <v-text-field
              label="New Password"
              v-model="form.password"
              :rules="rules.password"
              :append-icon="showPass2 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPass2 ? 'text' : 'password'"
              @click:append="showPass2 = !showPass2"
            />

            <v-text-field
              label="Repeat Password"
              v-model="form.repeatPassword"
              :rules="rules.repeatPassword"
              :append-icon="showPass3 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPass3 ? 'text' : 'password'"
              @click:append="showPass3 = !showPass3"
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
  data() {
    return {
      title: 'User name',
      opened: false,
      loading: false,
      valid: false,
      showPass1: false,
      showPass2: false,
      showPass3: false,
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
    activateRules() {
      this.rules = {
        oldPassword: [
          v => !!v || "Old password is required",
          v => (v.length >= 4 && v.length <= 16) || "Old password must be between 4-16 chars",
        ],
        password: [
          v => !!v || "New password is required",
          v => (v.length >= 4 && v.length <= 16) || "New password must be between 4-16 chars",
          v => v != this.form.oldPassword || "Old and New passwords must be different",
        ],
        repeatPassword: [
          v => !!v || "Repeat Password is required",
          v => v == this.form.password || "Passwords must be the same"
        ],
      }
    },
    open(title) {
      this.title = title;
      this.opened = true;
      let self = this;
      Utility.doubleRaf(() => {
        self.$refs.form.resetValidation();
        self.$refs.oldPassword.focus();
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
