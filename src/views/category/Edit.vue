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
          <span>{{ form.id ? 'Edit' : 'New' }} Category</span>
          <v-btn icon @click="close"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-divider class="mb-3"></v-divider>

        <v-card-text>

          <v-form ref="form" v-model="valid" @submit.prevent>
            <input type="hidden" :value="form.id" >

            <v-text-field
              label="Name"
              v-model="form.value"
              :rules="rules.value"
              type="text"
              maxlength="50"
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
            @click="save"
            color="success"
            :disabled="$store.get('session/isNotEditor')"
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
        value: '',
      },
    };
  },
  methods: {
    open(data) {
      this.opened = true;
      if (data) {
        this.form.id = data.id;
        this.form.value = data.name;
      } else {
        delete this.form.id;
        this.form.value = '';
      }
      this.$nextTick(() => this.$refs.form.resetValidation());
    },
    async save() {
      this.activateRules();
      await this.$refs.form.validate();
      if (this.valid) {
        this.form.text = this.form.value;
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
        value: [
          v => !!v || "Required",
          v => (v && v.length >= 2 && v.length <= 50) || "Name must be between 2-50 chars"
        ],
      }
    },
  },
};
</script>
