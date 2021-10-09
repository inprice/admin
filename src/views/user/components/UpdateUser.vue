<template>
  <v-dialog 
    v-model="show"
    overlay-opacity="0.3"
    content-class="rounded-dialog"
  >
    <v-card>
      <v-card-title class="pb-0 d-flex justify-space-between">
        <div>Profile</div>
        <v-btn icon @click="close"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>

      <v-card-text class="py-0 mt-3">
        <v-form ref="form" v-model="valid" @submit.prevent>
          <v-text-field
            dense
            outlined
            label="Your Name"
            v-model="form.fullName"
            :rules="rules.fullName"
            type="text"
            maxlength="70"
          />

          <v-select
            dense
            outlined
            label="Timezone"
            v-model="form.timezone"
            :items="timezones"
            :menu-props="{ auto: true, overflowY: true }"
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
          :disabled="loading || $store.get('session/isNotAdmin')"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import UserService from '@/service/user';
import timezones from '@/data/timezones';
import { get } from 'vuex-pathify'

export default {
  computed: {
    CURSTAT: get('session/getCurrentStatus')
  },
  data() {
    return {
      title: 'User Email',
      show: false,
      loading: false,
      valid: false,
      timezones,
      rules: {},
      form: {
        fullName: '',
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
        }
        this.loading = false;
      }
    },
    open(data) {
      this.show = true;
      let self = this;
      this.$nextTick(() => {
        self.$refs.form.resetValidation();
        self.form = data;
      });
    },
    close() {
      this.$refs.form.resetValidation();
      this.show = false;
      this.loading = false;
    },
    activateRules() {
      this.rules = {
        fullName: [
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
