<template>
  <v-dialog 
    v-model="show"
    overlay-opacity="0.3"
    content-class="rounded-dialog"
  >
    <v-card>
      <v-card-title class="pb-0 d-flex justify-space-between">
        <div>Change password</div>
        <v-btn icon @click="close"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>

      <v-card-text class="py-0 mt-3">
        <v-form ref="form" v-model="valid" @submit.prevent>
          <v-text-field
            dense
            outlined
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
            dense
            outlined
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
            dense
            outlined
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

      <v-divider></v-divider>

      <v-card-actions class="justify-end pa-3">
        <v-btn
          text
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
</template>

<script>
import UserService from '@/service/user';
import Utility from '@/helpers/utility';

export default {
  data() {
    return {
      title: 'User name',
      show: false,
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
        if (result == true) this.close();
        this.loading = false;
      }
    },
    open(title) {
      this.title = title;
      this.show = true;
      let self = this;
      this.$nextTick(() => {
        self.$refs.form.resetValidation();
        Utility.removeTabIndexFromIconButtons(self.$el);
      });
    },
    close() {
      this.show = false;
      this.loading = false;
      this.$refs.form.resetValidation();
    },
    activateRules() {
      this.rules = {
        oldPassword: [
          v => !!v || "Required",
          v => (v && v.length >= 6 && v.length <= 16) || "Must be between 6-16 chars",
        ],
        password: [
          v => !!v || "Required",
          v => (v && v.length >= 6 && v.length <= 16) || "Must be between 6-16 chars",
          v => (v && v != this.form.oldPassword) || "Old and New passwords must be different",
        ],
        repeatPassword: [
          v => !!v || "Required",
          v => (v && v.length >= 6 && v.length <= 16) || "Must be between 6-16 chars",
          v => (v && v == this.form.password) || "Passwords must be the same"
        ],
      }
    },
  }
};
</script>
