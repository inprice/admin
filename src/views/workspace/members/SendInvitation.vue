<template>
  <v-dialog 
    v-model="show"
    overlay-opacity="0.3"
    content-class="rounded-dialog"
  >
    <v-card>
      <v-card-title class="pb-0 d-flex justify-space-between">
        <span>Invite a member</span>
        <v-btn icon @click="close" class="my-auto"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>

      <v-card-text class="py-0 mt-3">
        <v-form ref="form" v-model="valid">
          <v-text-field
            dense
            outlined
            label="E-mail"
            v-model="form.email"
            :rules="rules.email"
            type="email"
            maxlength="100"
          />

          <v-select
            dense
            outlined
            label="Role"
            v-model="form.role"
            :rules="rules.role"
            :items="roles"
            :menu-props="{ auto: true, overflowY: true }"
          ></v-select>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="justify-end pa-3">
        <v-btn
          text
          @click="submit"
          color="primary"
          :loading="loading" 
          :disabled="$store.get('session/isNotEditor') || loading"
        >
          Invite
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { get } from 'vuex-pathify'
import Utility from '@/helpers/utility';

export default {
  computed: {
    currentEmail: get('session/getCurrentStatus@email')
  },
  data() {
    return {
      show: false,
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
      this.show = true;
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
