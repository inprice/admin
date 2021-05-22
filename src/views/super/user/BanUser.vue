<template>
  <v-row justify="center">

    <v-dialog 
      v-model="opened" 
       :max-width="findDialogWidth"
       overlay-opacity="0.2">
      <v-card>
        <v-card-title class="pr-3 justify-space-between">
          <div>
            <div>Ban user</div>
            <div class="caption">{{ form.email }}</div>
          </div>
          <v-btn icon @click="close" class="my-auto"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>

        <v-divider class="mb-4"></v-divider>

        <v-card-text class="pb-0">

          <v-form ref="form" v-model="valid" @submit.prevent>

            <v-text-field
              autofocus
              outlined
              dense
              label="Reason"
              v-model="form.reason"
              :rules="rules.reason"
              maxlength="128"
            />

          </v-form>

        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="py-3 justify-end">
          <v-btn
            text outlined
            tabindex="-1"
            @click="close"
          >
            Close
          </v-btn>
          <v-btn
            text outlined
            color="red"
            @click="save"
            :disabled="$store.get('session/isNotSuperUser')"
          >
            Ban
          </v-btn>

        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import SuperUserService from '@/service/super/user';

export default {
  computed: {
    findDialogWidth() {
      switch (this.$vuetify.breakpoint.email) {
        case 'xs': return '80%';
        case 'sm': return '50%';
        case 'md': return '35%';
        case 'lg': return '27%';
        default: return '18%';
      }
    },
  },
  data() {
    return {
      opened: false,
      valid: false,
      rules: {},
      form: {
        id: null,
        email: null,
        text: null,
        reason: null,
      },
    };
  },
  methods: {
    open(form) {
      const self = this;
      self.form = form;
      self.opened = true;
      self.$nextTick(() => self.$refs.form.resetValidation());
    },
    async save() {
      this.activateRules();
      await this.$refs.form.validate();
      if (this.valid) {
        SuperUserService.ban({ id: this.form.id, text: this.form.reason })
          .then((res) => {
            if (res && res.status) {
              this.$store.commit('snackbar/setMessage', { text: `${this.form.email} is successfully banned.` });
              this.$emit('banned');
              this.close();
            }
          });
      }
    },
    close() {
      this.opened = false;
      this.rules = {};
    },
    activateRules() {
      this.rules = {
        reason: [
          v => !!v || "Required",
          v => (v && v.length >= 5 && v.length <= 128) || "Reason must be between 5-128 chars"
        ],
      }
    },
  },
};
</script>
