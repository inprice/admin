<template>
  <v-row justify="center">

    <v-dialog v-model="opened" max-width="450">
      <v-card>
        <v-card-title>{{ isInsert ? 'Create a new company' : 'Update company info' }}</v-card-title>

        <v-card-subtitle class="pb-0" v-if="isInsert">
          You will be able to see new company after sign in again.
        </v-card-subtitle>

        <v-form ref="form" v-model="valid" class="mt-5">
          <v-text-field class="mx-5"
            ref="name"
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
            maxlength="30"
          />
        </v-form>

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
import ApiService from '@/service/api';
import CompanyService from '@/service/company';
import Utility from '@/helpers/utility';

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
      }
    };
  },
  methods: {
    async submit() {
      if (Object.keys(this.rules).length == 0) this.activateRules();
      await this.$refs.form.validate();
      if (this.valid) {
        this.loading = true;

        if (this.isInsert) {
          const result = await CompanyService.create(this.form);
          if (result == true) {
            Utility.showInfoMessage('Create Company', 'Successfull, you will be able to work with new company after sign in again.');
            this.close();
            return;
          }
        } else {
          const result = await CompanyService.update(this.form);
          if (result == true) {
            this.$store.set('session/COMPANY_INFO', this.form);
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
          v => v.length >= 5 && v.length <= 30 || "Must be between 5-30 chars"
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
          ApiService.get('/company/geo')
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
      let self = this;
      Utility.doubleRaf(() => {
        self.$refs.form.resetValidation();
        self.$refs.name.focus();
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
