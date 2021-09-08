<template>
  <v-row justify="center">

    <v-dialog 
      v-model="opened" 
      :max-width="findDialogWidth"
      overlay-opacity="0.2"
      @keydown.esc="close"
    >
      <v-card>
        <div class="d-flex justify-space-between pa-4 pb-1">
          <div>
            <div class="title">Update info</div>
            <div class="body-2">for {{ title }}</div>
          </div>
          <v-btn icon @click="close"><v-icon>mdi-close</v-icon></v-btn>
        </div>

        <v-divider></v-divider>

        <v-card-text class="pt-2 pb-0">
          <v-form ref="form" v-model="valid" @submit.prevent>
            <v-text-field
              label="Your Name"
              v-model="form.name"
              :rules="rules.name"
              type="text"
              maxlength="70"
            />

            <v-select
              label="Timezone"
              v-model="form.timezone"
              :items="timezones"
              :menu-props="{ auto: true, overflowY: true }"
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
            :disabled="loading || $store.get('session/isNotAdmin')"
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
import timezones from '@/data/timezones';
import { get } from 'vuex-pathify'

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
    CURSTAT: get('session/getCurrentStatus')
  },
  data() {
    return {
      title: 'User Email',
      opened: false,
      loading: false,
      valid: false,
      timezones,
      rules: {},
      form: {
        name: '',
        timezone: ''
      }
    };
  },
  methods: {
    async submit() {
      if (Object.keys(this.rules).length == 0) this.activateRules();
      await this.$refs.form.validate();
      if (this.valid) {
        this.loading = true;
        const result = await UserService.update(this.form);
        if (result == true) {
          this.$store.set('session/USER_INFO', this.form);
          this.close();
          return;
        }
        this.loading = false;
      }
    },
    open(data) {
      this.title = data.email;
      this.opened = true;
      let self = this;
      this.$nextTick(() => {
        self.$refs.form.resetValidation();
        self.form = data;
      });
    },
    close() {
      this.$refs.form.resetValidation();
      this.opened = false;
      this.loading = false;
    },
    activateRules() {
      this.rules = {
        name: [
          v => !!v || "Required",
          v => (v.length >= 3 && v.length <= 70) || "Must be between 3-70 chars"
        ],
        timezone: [
          v => !!v || "Timezone required",
        ],
      }
    },
  }
};
</script>
