<template>
  <v-row justify="center">

    <v-dialog v-model="opened" max-width="450" overlay-opacity="0.2">
      <v-card>
        <v-card-title>Update info</v-card-title>
        <v-card-subtitle class="pb-2">for {{ CURSTAT.email }}</v-card-subtitle>

        <v-divider></v-divider>

        <v-card-text class="pt-2 pb-0">
          <v-form ref="form" v-model="valid">
            <v-text-field
              autofocus
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
import timezones from '@/data/timezones';
import { get } from 'vuex-pathify'

export default {
  computed: {
    CURSTAT: get('session/getCurrentStatus')
  },
  data() {
    return {
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
          v => !!v || "Timezone is required",
        ],
      }
    },
  }
};
</script>
