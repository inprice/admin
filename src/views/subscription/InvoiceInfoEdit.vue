<template>
  <v-row justify="center">

    <v-dialog 
      v-model="opened" 
      :max-width="findDialogWidth"
      overlay-opacity="0.2">
      <v-card>
        <div class="d-flex justify-space-between pa-4 pb-1">
          <div class="title">Invoice info</div>
          <v-btn icon @click="opened = false"><v-icon>mdi-close</v-icon></v-btn>
        </div>

        <v-divider></v-divider>

        <v-form ref="form" v-model="valid" class="mt-5">
          <v-text-field class="mx-5"
            autofocus
            outlined dense
            label="Title"
            v-model="form.title"
            :rules="rules.title"
            type="text"
            maxlength="255"
          />

          <v-text-field class="mx-5"
            label="Address 1"
            outlined dense
            v-model="form.address1"
            :rules="rules.address1"
            type="text"
            maxlength="255"
          />

          <v-text-field class="mx-5"
            label="Address 2"
            outlined dense
            v-model="form.address2"
            :rules="rules.address2"
            type="text"
            maxlength="255"
          />

          <v-row class="mx-2">
            <v-col class="py-0">
              <v-text-field
                label="City"
                outlined dense
                v-model="form.city"
                :rules="rules.city"
                type="text"
                maxlength="70"
              />
            </v-col>
            <v-col class="py-0">
              <v-select
                label="Country"
                outlined dense
                v-model="form.country"
                item-text="text"
                item-value="value"
                :rules="rules.country"
                :items="list"
                :menu-props="{ auto: true, overflowY: true }"
              />
            </v-col>
          </v-row>

          <v-row class="mx-2">
            <v-col class="py-0">
              <v-text-field
                label="Postcode"
                outlined dense
                v-model="form.postcode"
                :rules="rules.postcode"
                type="text"
                maxlength="8"
              />
            </v-col>
            <v-col class="py-0">
              <v-text-field
                label="State"
                outlined dense
                v-model="form.state"
                :rules="rules.state"
                type="text"
                maxlength="70"
              />
            </v-col>
          </v-row>
          
        </v-form>

        <v-divider></v-divider>

        <v-card-actions class="py-4 justify-end">
          <v-btn small tabindex="-1" @click="close">Close</v-btn>
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
  </v-row>
</template>

<script>
import SubsService from '@/service/subscription';

export default {
  props: ['list'],
  computed: {
    findDialogWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '80%';
        case 'sm': return '50%';
        case 'md': return '35%';
        case 'lg': return '27%';
        default: return '16%';
      }
    },
  },
  data() {
    return {
      opened: false,
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
      this.opened = true;
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
      this.opened = false;
      this.loading = false;
    },
    activateRules() {
      this.rules = {
        title: [
          v => !!v || "Required",
          v => (v && v.length >= 3 && v.length <= 255) || "Must be between 3-255 chars"
        ],
        address1: [
          v => !!v || "Required",
          v => (v && v.length >= 3 && v.length <= 255) || "Must be between 3-255 chars"
        ],
        address2: [
          v => (!v || v.length <= 255) || "Must be less than 256 chars"
        ],
        postcode: [
          v => (!v || v.length <= 8) || "Must be less than 9 chars"
        ],
        city: [
          v => !!v || "Required",
          v => (v && v.length <= 70) || "Must be less than 71 chars"
        ],
        state: [
          v => (!v || v.length <= 70) || "Must be less than 71 chars"
        ],
        country: [
          v => !!v || "Required"
        ],
      }
    },
  }
};
</script>
