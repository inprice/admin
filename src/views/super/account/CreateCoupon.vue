<template>
  <v-row justify="center">

    <v-dialog 
      v-model="opened" 
      :max-width="findDialogWidth"
      overlay-opacity="0.2"
      @keydown.esc="opened = false"
    >
      <v-card>
        <v-card-title class="pr-3 justify-space-between">
          <div>
            <div>Create Coupon</div>
            <div class="caption">For {{ form.name }}</div>
          </div>
          <v-btn icon @click="close" class="my-auto"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>

        <v-divider class="mb-3"></v-divider>

        <v-card-text class="pb-2">

          <v-form ref="form" v-model="valid" @submit.prevent>
            <v-select
              dense
              outlined
              label="Plan"
              v-model="selectedPlan"
              :rules="rules.selectedPlan"
              :items="plansSets"
              item-text="name"
              return-object
            ></v-select>

            <v-text-field
              outlined
              dense
              label="Days"
              v-model="form.days"
              :rules="rules.days"
              maxlength="3"
              @blur="formatDays"
            />

            <v-text-field
              outlined
              dense
              label="Description"
              v-model="form.description"
              :rules="rules.description"
              maxlength="128"
            />

          </v-form>

        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="py-4 justify-end">
          <v-btn
            text
            tabindex="-1"
            @click="close"
          >
            Close
          </v-btn>
          <v-btn
            text
            color="success"
            @click="save"
            :disabled="$store.get('session/isNotSuperUser')"
          >
            Create
          </v-btn>

        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import SuperAccountService from '@/service/super/account';
import SystemService from '@/service/system';

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
    },
  },
  data() {
    return {
      opened: false,
      valid: false,
      rules: {},
      form: {
        accountId: null,
        name: null,
        planId: null,
        description: null,
        days: 30,
      },
      selectedPlan: null,
      plansSets: [],
    };
  },
  methods: {
    open(form) {
      const self = this;
      self.form.accountId = form.id;
      self.form.name = form.name;
      self.opened = true;
      self.$nextTick(() => {
        self.$refs.form.resetValidation()
        SystemService.fetchPlans()
          .then((res) => {
            if (res && res.data) {
              self.plansSets = res.data;
              self.selectedPlan = self.plansSets[0];
            }
          });
      });
    },
    async save() {
      this.activateRules();
      await this.$refs.form.validate();
      if (this.valid) {
        this.form.planId = this.selectedPlan.id;
        SuperAccountService.createCoupon(this.form)
          .then((res) => {
            if (res && res.data) {
              this.$store.commit('snackbar/setMessage', { text: `${res.data.code} is successfully created for ${this.form.name}` });
              this.close();
            }
          });
      }
    },
    close() {
      this.opened = false;
      this.rules = {};
    },
    activateRules() {
      this.rules = {
        selectedPlan: [
          v => !!v || "Required",
        ],
        days: [
          v => !!v || "Required",
          v => (parseInt(v) >= 14 && parseInt(v) <= 365) || "Days must be between 14-365"
        ],
        description: [
          v => (!v || (v.length >= 3 && v.length <= 128)) || "If given, must be between 3-128 chars"
        ],
      }
    },
    formatDays() {
      this.form.days = parseInt(('0' + this.form.days).replace(/[^\d.]/g, ''));
    }
  },
};
</script>
