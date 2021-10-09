<template>
  <v-dialog 
    v-model="show" 
    overlay-opacity="0.3"
    content-class="rounded-dialog"
  >
    <v-card>
      <v-card-title class="pb-0 d-flex justify-space-between">
        <span>{{ form.id ? 'Edit' : 'New' }} Brand</span>
        <v-btn icon @click="close"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>

      <v-card-text class="py-0 mt-5">
        <v-form ref="form" v-model="valid" @submit.prevent>
          <input type="hidden" :value="form.id" >

          <v-text-field
            outlined dense
            label="Name"
            v-model="form.value"
            :rules="rules.value"
            type="text"
            maxlength="50"
          />
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="justify-end pa-3">
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
</template>

<script>
export default {
  data() {
    return {
      show: false,
      valid: false,
      rules: {},
      form: {
        value: '',
      },
    };
  },
  methods: {
    open(data) {
      this.show = true;
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
      }
    },
    close() {
      this.show = false;
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
