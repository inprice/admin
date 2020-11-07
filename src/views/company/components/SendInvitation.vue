<template>
  <v-row justify="center">

    <v-dialog v-model="opened" max-width="350" overlay-opacity="0.2">
      <v-card>
        <v-card-title>Invite a user</v-card-title>
        <v-divider></v-divider>

        <v-card-text class="mt-5">
          <v-form ref="form" v-model="valid">
            <v-text-field
              autofocus
              label="E-mail"
              v-model="form.email"
              :rules="rules.email"
              type="email"
              maxlength="100"
            />

            <v-select
              label="Role"
              v-model="form.role"
              :rules="rules.role"
              :items="roles"
              :menu-props="{ auto: true, overflowY: true }"
            ></v-select>

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
            Invite
          </v-btn>
        </v-card-actions>

      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { get } from 'vuex-pathify'
import Utility from '@/helpers/utility';

export default {
  data() {
    return {
      opened: false,
      loading: false,
      valid: false,
      rules: {},
      form: {
        email: '',
        role: 'EDITOR'
      },
      roles: [
        'EDITOR',
        'VIEWER'
      ]
    };
  },
  computed: {
    currentEmail: get('auth/session@email')
  },
  methods: {
    async submit() {
      this.activateRules();
      await this.$refs.form.validate();
      if (this.valid) {
        this.loading = true;
        this.$emit('send', this.form);
      }
    },
    activateRules() {
      this.rules = {
        email: [
          v => !!v || "Required",
          v => v.length >= 9 && v.length <= 100 || "Must be between 9-100 chars",
          v => v.toLowerCase() != this.currentEmail.toLowerCase() || "You cannot add yourself as a member",
          v => Utility.verifyEmail(v) || "Must be valid"
        ],
        role: [
          v => !!v || "Required"
        ]
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
