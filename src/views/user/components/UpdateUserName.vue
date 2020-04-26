<template>
  <v-row justify="center">

    <v-dialog v-model="opened" max-width="350">
      <v-card>
        <v-card-title>Update name</v-card-title>

        <v-card-text class="mt-5">
          <v-form ref="form" v-model="valid">
            <v-text-field
              ref="userName"
              label="Your Name"
              v-model="form.userName"
              :rules="rules.userName"
              type="text"
              maxlenght="70"
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
      opened: false,
      loading: false,
      valid: false,
      rules: {},
      form: {
        userName: ''
      }
    };
  },
  methods: {
    async submit() {
      if (Object.keys(this.rules).length == 0) this.activateRules();
      await this.$refs.form.validate();
      if (this.valid) {
        this.loading = true;
        const result = await UserService.updateUserName(this.form);
        if (result == true) {
          this.$store.set('session/session@user', this.form.userName);
          this.close();
          return;
        }
        this.loading = false;
      }
    },
    activateRules() {
      this.rules = {
        userName: [
          v => !!v || "Required",
          v => (v.length >= 3 && v.length <= 70) || "Must be between 3-70 chars"
        ],
      }
    },
    open(name) {
      this.form.userName = name;
      this.opened = true;
      let self = this;
      Utility.doubleRaf(() => {
        self.$refs.form.resetValidation();
        self.$refs.userName.focus();
      });
    },
    close() {
      this.$refs.form.resetValidation();
      this.opened = false;
      this.loading = false;
    }
  }
};
</script>
