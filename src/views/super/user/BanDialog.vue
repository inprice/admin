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
            <div>Ban user</div>
            <div class="caption">{{ form.name }}</div>
          </div>
          <v-btn icon @click="close" class="my-auto"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>

        <v-divider class="mb-4"></v-divider>

        <v-card-text class="pb-0">

          <v-form ref="form" v-model="valid" @submit.prevent>

            <v-text-field
              autofocus
              outlined
              dense
              label="Reason"
              v-model="form.text"
              :rules="rules.text"
              maxlength="128"
            />

          </v-form>

        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="py-3 justify-end">
          <v-btn
            text
            tabindex="-1"
            @click="close"
          >
            Close
          </v-btn>
          <v-btn
            text
            color="red"
            @click="save"
            :disabled="$store.get('session/isNotSuperUser')"
          >
            Ban
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
        default: return '50%';
      }
    },
  },
  data() {
    return {
      opened: false,
      valid: false,
      rules: {},
      form: {
        id: null,
        name: null,
        text: null,
      },
    };
  },
  methods: {
    open(form) {
      const self = this;
      self.form = form;
      self.opened = true;
      self.$nextTick(() => self.$refs.form.resetValidation());
    },
    async save() {
      this.activateRules();
      await this.$refs.form.validate();
      if (this.valid) {
        this.$emit('banned', this.form);
        this.close();
      }
    },
    close() {
      this.opened = false;
      this.rules = {};
    },
    activateRules() {
      this.rules = {
        text: [
          v => !!v || "Required",
          v => (v && v.length >= 5 && v.length <= 128) || "Reason must be between 5-128 chars"
        ],
      }
    },
  },
};
</script>
