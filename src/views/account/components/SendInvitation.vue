<template>
  <div class="d-flex justify-center">

    <v-dialog 
      v-model="opened" 
      :max-width="findDialogWidth"
      @keydown.esc="close"
      overlay-opacity="0.2">
      <v-card>
        <div class="d-flex justify-space-between pa-3">
          <div class="title">Invite a user</div>
          <v-btn icon class="my-auto" @click="close"><v-icon>mdi-close</v-icon></v-btn>
        </div>

        <v-divider></v-divider>

        <v-card-text class="pb-2">
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
              dense
              label="Role"
              class="mt-2"
              v-model="form.role"
              :rules="rules.role"
              :items="roles"
              :menu-props="{ auto: true, overflowY: true }"
            ></v-select>

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
            :disabled="$store.get('session/isNotEditor') || loading"
          >
            Invite
          </v-btn>
        </v-card-actions>

      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import { get } from 'vuex-pathify'
import Utility from '@/helpers/utility';

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
    currentEmail: get('session/getCurrentStatus@email')
  },
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
