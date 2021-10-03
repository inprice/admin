<template>
  <v-dialog 
    v-model="show"
    overlay-opacity="0.3"
    content-class="rounded-dialog"
  >
    <v-card>
      <v-card-title class="pb-0 d-flex justify-space-between">
        <div>
          <div>Ban user</div>
          <div class="caption">{{ form.name }}</div>
        </div>
        <v-btn icon @click="close" class="my-auto"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>

      <v-card-text class="py-0 mt-3">
        <v-form ref="form" v-model="valid">
          <v-text-field
            dense
            outlined
            label="Reason"
            v-model="form.text"
            :rules="rules.text"
            maxlength="128"
          />
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="justify-end pa-3">
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
</template>

<script>
export default {
  data() {
    return {
      show: false,
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
      self.show = true;
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
      this.show = false;
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
