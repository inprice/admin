<template>
  <v-row justify="center">

    <v-dialog 
      v-model="opened" 
      :max-width="($vuetify.breakpoint.smAndDown ? '90%' : '30%')"
      overlay-opacity="0.2">
      <v-card>
        <v-card-title>Invoice info</v-card-title>
        <v-divider></v-divider>

        <v-form ref="form" v-model="valid" class="mt-5">
          <v-text-field class="mx-5"
            autofocus
            label="Title"
            v-model="form.title"
            :rules="rules.title"
            type="text"
            maxlength="255"
          />

          <v-text-field class="mx-5"
            label="Address 1"
            v-model="form.address1"
            :rules="rules.address1"
            type="text"
            maxlength="255"
          />

          <v-text-field class="mx-5"
            label="Address 2"
            v-model="form.address2"
            :rules="rules.address2"
            type="text"
            maxlength="255"
          />

          <v-row class="mx-2">
            <v-col class="py-0">
              <v-text-field
                label="Postcode"
                v-model="form.postcode"
                :rules="rules.postcode"
                type="text"
                maxlength="8"
              />
            </v-col>
            <v-col class="py-0">
              <v-text-field
                label="City"
                v-model="form.city"
                :rules="rules.city"
                type="text"
                maxlength="70"
              />
            </v-col>
          </v-row>

          <v-row class="mx-2">
            <v-col class="py-0">
              <v-text-field
                label="State"
                v-model="form.state"
                :rules="rules.state"
                type="text"
                maxlength="70"
              />
            </v-col>
            <v-col class="py-0">
              <v-select
                label="Country"
                v-model="form.country"
                :rules="rules.country"
                :items="countries"
                :menu-props="{ auto: true, overflowY: true }"
              />
            </v-col>
          </v-row>
          
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
import SubsService from '@/service/subscription';

export default {
  props: {
    countries: {
      type: Array
    }
  },
  data() {
    return {
      opened: false,
      loading: false,
      valid: false,
      rules: {},
      form: {}
    };
  },
  methods: {
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
    fetchData() {
      SubsService.getInfo()
        .then((res) => {
          if (res && res.data) {
            this.form = res.data;
            for (let i = 0; i < this.countries.length; i++) {
              const country = this.countries[i];
              if (country.value == this.country) {
                this.country = country.text;
                break;
              }
            }
          }
        });
    },
    open() {

      this.fetchData();
      this.opened = true;
    },
    close() {
      this.$refs.form.resetValidation();
      this.opened = false;
      this.loading = false;
    },
    activateRules() {
      this.rules = {
        title: [
          v => !!v || "Required",
          v => (v.length >= 3 && v.length <= 255) || "Must be between 3-255 chars"
        ],
        address1: [
          v => !!v || "Required",
          v => (v.length >= 3 && v.length <= 255) || "Must be between 3-255 chars"
        ],
        address2: [
          v => (v.length <= 255) || "Must be less than 256 chars"
        ],
        postcode: [
          v => (v.length <= 8) || "Must be less than 9 chars"
        ],
        city: [
          v => !!v || "Required",
          v => (v.length <= 70) || "Must be less than 71 chars"
        ],
        state: [
          v => (v.length <= 70) || "Must be less than 71 chars"
        ],
        country: [
          v => !!v || "Required"
        ],
      }
    },
  }
};
</script>
