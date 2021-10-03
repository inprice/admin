<template>
  <v-dialog 
    v-model="show"
    overlay-opacity="0.3"
    content-class="rounded-dialog"
  >
    <v-card>
      <v-card-title class="pb-0 d-flex justify-space-between">
        <span>Edit Platform</span>
        <v-btn icon @click="close"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>

      <v-card-text class="py-0 mt-3">
        <v-form ref="form" v-model="valid">
          <input type="hidden" :value="form.id" >

          <v-text-field
            dense
            outlined
            label="Name"
            v-model="form.name"
            :rules="rules.name"
            maxlength="50"
          />

          <v-text-field
            dense
            outlined
            label="Queue"
            v-model="form.queue"
            :rules="rules.queue"
            maxlength="50"
          />

          <v-text-field
            dense
            outlined
            label="Profile"
            v-model="form.profile"
            :rules="rules.profile"
            maxlength="15"
          />

          <v-text-field
            dense
            outlined
            label="Currency"
            v-model="form.currencyCode"
            :rules="rules.currencyCode"
            maxlength="3"
          />

          <v-text-field
            dense
            outlined
            label="Format"
            v-model="form.currencyFormat"
            :rules="rules.currencyFormat"
            maxlength="30"
          />

          <div class="d-flex justify-space-between">
            <v-switch
              label="Parked ?"
              color="red"
              v-model="form.parked"
              hide-details
            />

            <v-switch
              label="Blocked ?"
              color="red"
              v-model="form.blocked"
              hide-details
            />
          </div>

        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="justify-end pa-3">
        <v-btn
          text
          @click="save"
          color="success"
          :disabled="$store.get('session/isNotSuperUser')"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      valid: false,
      rules: {},
      form: {
        name: '',
        queue: '',
        profile: '',
        currencyCode: '',
        currencyFormat: '',
        parked: false,
        blocked: false
      },
    };
  },
  methods: {
    open(data) {
      if (data) {
        this.form.id = data.id;
        this.form.name = data.name;
        this.form.queue = data.queue;
        this.form.profile = data.profile;
        this.form.currencyCode = data.currencyCode;
        this.form.currencyFormat = data.currencyFormat;
        this.form.parked = data.parked;
        this.form.blocked = data.blocked;
      }

      let self = this;
      this.$nextTick(() => {
        self.$refs.form.resetValidation();
      });
      this.show = true;
    },
    async save() {
      this.activateRules();
      await this.$refs.form.validate();
      if (this.valid) {
        this.$emit('saved', this.form);
      }
    },
    close() {
      this.show = false;
      this.rules = {};
    },
    activateRules() {
      this.rules = {
        name: [
          v => !!v || "Required",
          v => (v && v.length >= 3 && v.length <= 50) || "Name must be between 3-50 chars"
        ],
        queue: [
          v => !!v || "Required",
          v => (v && v.length >= 5 && v.length <= 50) || "Name must be between 5-50 chars"
        ],
        profile: [
          v => !!v || "Required",
          v => (v && v.length >= 3 && v.length <= 15) || "Name must be between 3-15 chars"
        ],
        currencyCode: [
          v => (!v || (v.length != 128)) || "Must be 3 chars"
        ],
        currencyFormat: [
          v => !!v || "Required",
          v => (v && v.length >= 3 && v.length <= 30) || "Must be between 3-30 chars"
        ],
      }
    }
  },
};
</script>
