<template>
  <v-dialog 
    v-model="show"
    overlay-opacity="0.3"
    content-class="rounded-dialog"
  >
    <v-card>
      <v-card-title class="pb-0 d-flex justify-space-between">
        <span>{{ isInsert ? 'New workspace' : 'Workspace info' }}</span>
        <v-btn icon @click="close" class="my-auto"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>

      <v-card-text class="py-0 mt-3">
        <v-form ref="form" v-model="valid" @submit.prevent>
          <v-text-field
            dense
            outlined
            label="Name"
            v-model="form.name"
            :rules="rules.name"
            type="text"
            maxlength="70"
          />

          <v-select
            dense
            outlined
            label="Currency"
            v-model="form.currencyCode"
            :items="currencyNames"
            :menu-props="{ auto: true, overflowY: true }"
            @change="setCurrencyFormat"
          />

          <v-text-field
            dense
            outlined
            label="Currency Format"
            v-model="form.currencyFormat"
            :rules="rules.currencyFormat"
            type="text"
            maxlength="16"
          />
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-3">
        <div v-if="isInsert" class="caption ml-3">
          <div class="red--text font-weight-medium">Please note that</div>
          <div>You will be able to see new workspace after login again!</div>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          text
          @click="submit"
          color="success"
          :loading="loading" 
          :disabled="$store.get('session/isNotAdmin') || loading"
        >
          {{ isInsert ? 'Save' : 'Update' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ApiService from '@/service/api';
import WorkspaceService from '@/service/workspace';

import currencyNames from '@/data/currency-names';
import currencyFormats from '@/data/currency-formats';

export default {
  data() {
    return {
      isInsert: true,
      show: false,
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
          const res = await WorkspaceService.create(this.form);
          if (res == true) {
            this.$store.commit('snackbar/setMessage', { text: 'Successfull, you will be able to work with new workspace after sign in again.' });
            this.close();
          }
        } else {
          const res = await WorkspaceService.update(this.form);
          if (res == true) {
            this.$store.set('session/WORKSPACE_INFO', this.form);
            this.close();
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
    edit(data) {
      if (data) {
        this.isInsert = false;
        this.form.name = data.name;
        this.form.currencyCode = data.currencyCode;
        this.form.currencyFormat = data.currencyFormat;
      } else {
        this.isInsert = true;
        this.form.name = '';
        if (!this.form.currencyCode) {
          ApiService.get('/workspace/geo')
            .then((res) => {
              if (!this.form.currencyCode) this.form.currencyCode = res.data.data.currencyCode;
              if (!this.form.currencyFormat) this.form.currencyFormat = currencyFormats[this.form.currencyCode];
          });
        }
      }
      this.open();
    },
    open() {
      this.show = true;
      this.$nextTick(() => this.$refs.form.resetValidation());
    },
    close() {
      this.$refs.form.resetValidation();
      this.show = false;
      this.loading = false;
    },
  }
};
</script>
