<template>
  <v-row justify="center">

    <v-dialog v-model="opened" max-width="450">
      <v-card>
        <v-card-title>{{ isInsert ? 'Create a new' : 'Update' }} Company</v-card-title>

        <v-card-subtitle class="pb-0" v-if="isInsert">
          You will be able to see new company after sign in again.
        </v-card-subtitle>

        <v-form ref="form" v-model="valid" class="mt-5">
          <v-text-field class="mx-5"
            ref="companyName"
            label="Name"
            v-model="form.companyName"
            :rules="rules.companyName"
            type="text"
            maxlength="70"
          />

          <v-text-field class="mx-5"
            label="Website"
            v-model="form.website"
            :rules="rules.website"
            type="url"
            maxlength="100"
          />

          <v-select class="mx-5"
            label="Sector"
            v-model="form.sector"
            :items="sectors"
          />

          <v-select class="mx-5"
            label="Country"
            v-model="form.country"
            :rules="rules.country"
            :items="countries"
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
import CompanyService from '@/service/company';
import Utility from '@/helpers/utility';

import Consts from '@/helpers/consts';

export default {
  data() {
    return {
      isInsert: true,
      opened: false,
      loading: false,
      valid: false,
      rules: {},
      sectors: Consts.sectors,
      countries: Consts.countries,
      form: {
        companyName: '',
        website: '',
        sector: '',
        country: ''
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
            Utility.showInfoMessage('Create Company', 'You have been successfully created a new company. You can work with it after sign in again.');
            this.close();
            return;
          }
        } else {
          const result = await CompanyService.update(this.form);
          if (result == true) {
            this.$store.set('session/session@company', this.form.companyName);
            this.close();
            return;
          }
        }
        this.loading = false;
      }
    },
    activateRules() {
      this.rules = {
        companyName: [
          v => !!v || "Company name is required",
          v => (v.length >= 3 && v.length <= 70) || "Company name must be between 3-70 chars"
        ],
        website: [
          v => (v == '' || (v.length >= 10 && v.length <= 100)) || "If given, website must be between 10-100 chars"
        ],
        country: [
          v => !!v || "Country is required",
        ]
      }
    },
    update(data) {
      this.isInsert = false;
      this.form = data;
      this.open();
    },
    insert() {
      this.isInsert = true;
      this.form = {
        companyName: '',
        website: '',
        sector: '',
        country: ''
      };
      this.open();
    },
    open() {
      this.opened = true;
      let self = this;
      Utility.doubleRaf(() => {
        self.$refs.form.resetValidation();
        self.$refs.companyName.focus();
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
