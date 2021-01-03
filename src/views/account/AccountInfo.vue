<template>
  <div class="d-flex justify-center">

    <v-dialog 
      v-model="opened" 
      :max-width="($vuetify.breakpoint.smAndDown ? '90%' : '30%')"
      overlay-opacity="0.2">
      <v-card>
        <v-card-title>{{ isInsert ? 'New account' : 'Account info' }}</v-card-title>

        <v-card-subtitle class="pb-0" v-if="isInsert">
          You will be able to see new account after sign in again.
        </v-card-subtitle>

        <v-divider class="my-2"></v-divider>

        <v-form ref="form" v-model="valid" class="mt-5">
          <v-text-field class="mx-5"
            autofocus
            label="Name"
            v-model="form.name"
            :rules="rules.name"
            type="text"
            maxlength="70"
          />

          <v-select class="mx-5"
            label="Currency"
            v-model="form.currencyCode"
            :items="currencyNames"
            :menu-props="{ auto: true, overflowY: true }"
            @change="setCurrencyFormat"
          />

          <v-text-field class="mx-5"
            label="Currency Format"
            v-model="form.currencyFormat"
            :rules="rules.currencyFormat"
            type="text"
            maxlength="16"
          />

        </v-form>

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

//import numFormatter from 'number-format.js';
import currencyNames from '@/data/currency-names';
import currencyFormats from '@/data/currency-formats';

export default {
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
      sampleAmount: 0.25,
      sampleAmounts: [0.25, 100, 100.5, 1250.10, 3200.2443, 1263500.34 ],
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
