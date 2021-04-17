<template>
  <v-row justify="center">

    <v-dialog 
      v-model="opened" 
       :max-width="findDialogWidth"
       overlay-opacity="0.2">
      <v-card>
        <v-card-title class="pr-3">
          {{ form.id ? 'Edit' : 'New' }} Group
          <v-spacer></v-spacer>
          <v-btn icon @click="close"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>
        <v-divider></v-divider>

        <v-card-text class="pb-0">

          <v-form ref="form" v-model="valid">
            <input type="hidden" :value="form.id" >

            <v-text-field
              autofocus
              label="Name"
              v-model="form.name"
              :rules="rules.name"
              type="text"
              maxlength="500"
            />

            <v-text-field
              label="Price"
              v-model="form.price"
              :rules="rules.price"
              @blur="formatPrice"
              maxlength="10"
            />

          </v-form>

        </v-card-text>
        <v-card-subtitle class="mt-0">
          <span class="font-weight-medium text-decoration-underline">For competitive pricing</span>, please specify a price greater than zero!
        </v-card-subtitle>

        <v-divider></v-divider>

        <v-card-actions class="py-4">
          <v-spacer></v-spacer>
          <v-btn
            @click="save"
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
import GroupService from '@/service/group';

export default {
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
      form: {
        name: '',
        price: 0,
      },
    };
  },
  methods: {
    open(data) {
      this.opened = true;

      if (data) {
        this.form.id = data.id;
        this.form.name = data.name;
        this.form.price = data.price;
      }

      let self = this;
      this.$nextTick(() => {
        self.$refs.form.resetValidation();
        self.formatPrice();
      });
    },
    async save() {
      this.activateRules();
      await this.$refs.form.validate();
      if (this.valid) {
        this.loading = true;
        this.form.price = parseFloat(this.form.price);

        const result = await GroupService.save(this.form);
        if (result == true) {
          this.close();
          this.$emit('saved');
        }
        this.loading = false;
      }
    },
    close() {
      this.opened = false;
      this.loading = false;
      this.rules = {};
      this.$refs.form.reset();
    },
    activateRules() {
      this.rules = {
        name: [
          v => !!v || "Required",
          v => (v && v.length >= 3 && v.length <= 500) || "Name must be between 3-500 chars"
        ],
        price: [
          v => (parseFloat(v) > -1) || "Base Price must be greater or equal than 0"
        ],
      }
    },
    formatPrice() {
      this.form.price = parseFloat(('0' + this.form.price).replace(/[^\d.]/g, '')).toFixed(2);
    }
  },
};
</script>
