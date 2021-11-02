<template>
  <v-dialog 
    v-model="show"
    overlay-opacity="0.3"
    content-class="rounded-dialog"
  >
    <v-card>
      <v-card-title class="pb-0 d-flex justify-space-between">
        <div>
          <div>Create Voucher</div>
          <div class="caption">For {{ form.name }}</div>
        </div>
        <v-btn icon @click="close" class="my-auto"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>

      <v-card-text class="py-0 mt-3">
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
            :menu-props="{ bottom: true, offsetY: true }"
          ></v-select>

          <v-text-field
            dense
            outlined
            label="Days"
            v-model="form.days"
            :rules="rules.days"
            maxlength="3"
            @blur="formatDays"
          />

          <v-text-field
            dense
            outlined
            label="Description"
            v-model="form.description"
            :rules="rules.description"
            maxlength="128"
          />
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="justify-end pa-3">
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
</template>

<script>
import SuperWorkspaceService from '@/service/super/workspace';
import SystemService from '@/service/system';

export default {
  data() {
    return {
      show: false,
      valid: false,
      rules: {},
      form: {
        workspaceId: null,
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
      self.form.workspaceId = form.id;
      self.form.name = form.name;
      self.show = true;
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
        SuperWorkspaceService.createVoucher(this.form)
          .then((res) => {
            if (res && res.data) {
              this.$store.commit('snackbar/setMessage', { text: `${res.data.code} is successfully created for ${this.form.name}` });
              this.close();
            }
          });
      }
    },
    close() {
      this.show = false;
      this.rules = {};
    },
    activateRules() {
      this.rules = {
        selectedPlan: [
          v => !!v || "Required",
        ],
        days: [
          v => !!v || "Required",
          v => (parseInt(v) >= 14 && parseInt(v) <= 365) || "Must be between 14-365"
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
