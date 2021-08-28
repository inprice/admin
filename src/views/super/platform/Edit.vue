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
          <span>Edit Platform</span>
          <v-btn icon @click="close"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-divider class="mb-3"></v-divider>

        <v-card-text>

          <v-form ref="form" v-model="valid" @submit.prevent>
            <input type="hidden" :value="form.id" >

            <v-text-field
              autofocus
              label="Name"
              v-model="form.name"
              :rules="rules.name"
              maxlength="50"
            />

            <v-text-field
              label="Queue"
              v-model="form.queue"
              :rules="rules.queue"
              maxlength="50"
            />

            <v-text-field
              label="Profile"
              v-model="form.profile"
              :rules="rules.profile"
              maxlength="15"
            />

            <v-text-field
              label="Currency"
              v-model="form.currencyCode"
              :rules="rules.currencyCode"
              maxlength="3"
            />

            <v-text-field
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
            @click="save"
            color="success"
            :disabled="$store.get('session/isNotSuperUser')"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
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
      this.opened = true;

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
    },
    async save() {
      this.activateRules();
      await this.$refs.form.validate();
      if (this.valid) {
        this.$emit('saved', this.form);
        this.close();
      }
    },
    close() {
      this.opened = false;
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
