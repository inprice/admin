<template>
  <div class="d-flex justify-center">

    <v-dialog 
      v-model="opened" 
      :max-width="findDialogWidth"
      @keydown.esc="close"
      overlay-opacity="0.2">
      <v-card>
        <div class="d-flex justify-space-between pa-3">
          <div>
            <div class="title">{{ isInsert ? 'New account' : 'Account info' }}</div>
            <div class="caption" v-if="isInsert">
              You will be able to see new account after sign in again.
            </div>
          </div>
          <v-btn icon class="my-auto" @click="close"><v-icon>mdi-close</v-icon></v-btn>
        </div>

        <v-divider></v-divider>

        <v-card-text class="pb-2">
          
          <v-form ref="form" v-model="valid" class="mt-5">
            <v-text-field
              autofocus
              label="Name"
              v-model="form.name"
              :rules="rules.name"
              type="text"
              maxlength="70"
            />

            <v-select
              label="Currency"
              v-model="form.currencyCode"
              :items="currencyNames"
              :menu-props="{ auto: true, overflowY: true }"
              @change="setCurrencyFormat"
            />

            <v-text-field
              label="Currency Format"
              v-model="form.currencyFormat"
              :rules="rules.currencyFormat"
              type="text"
              maxlength="16"
            />

          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="justify-end py-3">
          <v-btn
            text outlined
            tabindex="-1"
            @click="close"
          >
            Close
          </v-btn>
          <v-btn
            text outlined
            @click="submit"
            color="primary"
            :loading="loading" 
            :disabled="$store.get('session/isNotAdmin') || loading"
          >
            Save
          </v-btn>
        </v-card-actions>

      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import ApiService from '@/service/api';
import AccountService from '@/service/account';

import currencyNames from '@/data/currency-names';
import currencyFormats from '@/data/currency-formats';

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
    }
  },
  data() {
    return {
      isInsert: true,
      opened: false,
      loading: false,
      valid: false,
      currencyNames,
      rules: {},
      form: {
        name: '',
        currencyCode: '',
        currencyFormat: ''
      },
    };
  },
  methods: {
    async submit() {
      if (Object.keys(this.rules).length == 0) this.activateRules();
      await this.$refs.form.validate();
      if (this.valid) {
        this.loading = true;

        if (this.isInsert) {
          const res = await AccountService.create(this.form);
          if (res == true) {
            this.$store.commit('snackbar/setMessage', { text: 'Successfull, you will be able to work with new account after sign in again.' });
            this.close();
            return;
          }
        } else {
          const res = await AccountService.update(this.form);
          if (res == true) {
            this.$store.set('session/ACCOUNT_INFO', this.form);
            this.close();
            return;
          }
        }
        this.loading = false;
      }
    },
    setCurrencyFormat() {
      if (this.form.currencyCode) {
        this.form.currencyFormat = currencyFormats[this.form.currencyCode];
      }
    },
    activateRules() {
      this.rules = {
        name: [
          v => !!v || "Required",
          v => (v.length >= 3 && v.length <= 70) || "Must be between 3-70 chars"
        ],
        currencyCode: [
          v => !!v || "Required",
        ],
        currencyFormat: [
          v => v.length >= 3 && v.length <= 16 || "Must be between 3-16 chars",
          v => ((v.match(/#/g)||[]).length == 3) || "Invalid format"
        ],
      }
    },
    edit(data, isInsert) {
      this.isInsert = isInsert;
      if (isInsert == false) {
        this.form = data;
      } else {
        this.form.name = '';
        if (!this.form.currencyCode) {
          ApiService.get('/account/geo')
            .then((res) => {
              if (!this.form.currencyCode) this.form.currencyCode = res.data.data.currencyCode;
              if (!this.form.currencyFormat) this.form.currencyFormat = currencyFormats[this.form.currencyCode];
          });
        }
      }
      this.open();
    },
    open() {
      this.opened = true;
      this.$nextTick(() => this.$refs.form.resetValidation());
    },
    close() {
      this.$refs.form.resetValidation();
      this.opened = false;
      this.loading = false;
    },
  }
};
</script>
