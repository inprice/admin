<template>
  <v-dialog 
    v-model="show"
    overlay-opacity="0.3"
    content-class="rounded-dialog"
  >
    <v-card>
      <v-card-title class="pb-0 d-flex justify-space-between">
        <span>Billing info</span>
        <v-btn icon @click="show = false"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>

      <v-card-text class="py-0 mt-3">
        <v-form ref="form" v-model="valid">

          <v-text-field
            dense
            outlined
            label="Title"
            v-model="form.title"
            :rules="rules.title"
            type="text"
            maxlength="255"
          />

          <v-text-field
            dense
            outlined
            label="Contact"
            v-model="form.contactName"
            :rules="rules.contactName"
            type="text"
            maxlength="50"
          />

          <v-row>
            <v-col class="py-0">
              <v-text-field
                dense
                outlined
                label="Tax Id"
                v-model="form.taxId"
                :rules="rules.taxId"
                type="text"
                maxlength="16"
              />
            </v-col>
            <v-col class="py-0">
              <v-text-field
                dense
                outlined
                label="Tax Office"
                v-model="form.taxOffice"
                :rules="rules.taxOffice"
                type="text"
                maxlength="25"
              />
            </v-col>
          </v-row>

          <v-text-field
            dense
            outlined
            label="Address 1"
            v-model="form.address1"
            :rules="rules.address1"
            type="text"
            maxlength="255"
          />

          <v-text-field
            dense
            outlined
            label="Address 2"
            v-model="form.address2"
            :rules="rules.address2"
            type="text"
            maxlength="255"
          />

          <v-row>
            <v-col class="py-0">
              <v-text-field
                dense
                outlined
                label="City"
                v-model="form.city"
                :rules="rules.city"
                type="text"
                maxlength="70"
              />
            </v-col>
            <v-col class="py-0">
              <v-text-field
                dense
                outlined
                label="Postcode"
                v-model="form.postcode"
                :rules="rules.postcode"
                type="text"
                maxlength="8"
              />
            </v-col>
          </v-row>

          <v-text-field 
            dense
            outlined
            label="State"
            v-model="form.state"
            :rules="rules.state"
            type="text"
            maxlength="70"
          />

          <v-select 
            dense
            outlined
            label="Country"
            v-model="form.country"
            :rules="rules.country"
            :items="countries"
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
import SubsService from '@/service/subscription';

export default {
  props: ['countries'],
  data() {
    return {
      show: false,
      loading: false,
      valid: false,
      rules: {},
      form: {},
    };
  },
  methods: {
    open(info) {
      if (this.$refs && this.$refs.form) this.$refs.form.resetValidation();
      this.form = info;
      this.show = true;
    },
    async submit() {
      if (Object.keys(this.rules).length == 0) this.activateRules();
      await this.$refs.form.validate();
      if (this.valid) {
        this.loading = true;
        const result = await SubsService.saveInfo(this.form);
        if (result == true) {
          this.$store.commit('snackbar/setMessage', { text: 'Your invoice info is successfully saved.' });
          this.$emit('saved', this.form);
          this.close();
        }
        this.loading = false;
      }
    },
    close() {
      this.$refs.form.resetValidation();
      this.show = false;
      this.loading = false;
    },
    activateRules() {
      this.rules = {
        title: [
          v => !!v || "Required",
          v => (v && v.length >= 3 && v.length <= 255) || "Must be between 3 - 255 chars"
        ],
        address1: [
          v => !!v || "Required",
          v => (v && v.length >= 3 && v.length <= 255) || "Must be between 3 - 255 chars"
        ],
        city: [
          v => !!v || "Required",
          v => (v && v.length >= 2 && v.length <= 50) || "Must be between 2 - 50 chars"
        ],
        country: [
          v => !!v || "Required"
        ],
        contactName: [
          v => (!v || (v.length <= 70)) || "Can be up to 50 chars"
        ],
        taxId: [
          v => (!v || (v.length <= 16)) || "Can be up to 16 chars"
        ],
        taxOffice: [
          v => (!v || (v.length <= 25)) || "Can be up to 25 chars"
        ],
        address2: [
          v => (!v || v.length <= 255) || "Can be up to 255 chars"
        ],
        postcode: [
          v => (!v || v.length <= 8) || "Can be up to 8 chars"
        ],
        state: [
          v => (!v || v.length <= 50) || "Can be up to 50 chars"
        ],
      }
    },
  }
};
</script>
