<template>
  <v-row justify="center">

    <v-dialog v-model="opened" max-width="500">
      <v-card>
        <v-card-title>Product details</v-card-title>

        <v-card-text class="mt-5">

          <v-form ref="form" v-model="valid">
            <input type="hidden" :value="form.id" >

            <v-text-field
              ref="code"
              label="Code"
              v-model="form.code"
              :rules="rules.code"
              type="text"
            />

            <v-text-field
              label="Name"
              v-model="form.name"
              :rules="rules.name"
              type="text"
            />

            <v-text-field
              label="Price"
              v-model.lazy="form.price"
              :rules="rules.price"
              @blur="formatPrice"
              maxlength="10"
            />

            <v-row>
              <v-col class="pa-0">
                <v-text-field
                  class="col"
                  label="Brand"
                  v-model="form.brand"
                  :rules="rules.brand"
                  type="text"
                />
              </v-col>

              <v-col class="pa-0">
                <v-text-field
                  class="col"
                  label="Category"
                  v-model="form.category"
                  :rules="rules.category"
                  type="text"
                />
              </v-col>
            </v-row>
          </v-form>

        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn @click="close">Close</v-btn>
          <v-btn
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
import Utility from '@/helpers/utility';

export default {
  data() {
    return {
      opened: false,
      loading: false,
      valid: false,
      rules: {},
      form: {
        id: 0,
        code: '',
        name: '',
        price: 0,
        brand: '',
        category: ''
      }
    };
  },
  methods: {
    async submit() {
      this.activateRules();
      await this.$refs.form.validate();
      if (this.valid) {
        this.loading = true;
        this.$emit('saved', this.form)
        this.loading = false;
      }
    },
    activateRules() {
      this.rules = {
        code: [
          v => !!v || "Code is required",
          v => (v.length >= 3 && v.length <= 120) || "Code must be between 3-120 chars"
        ],
        name: [
          v => !!v || "Name is required",
          v => (v.length >= 3 && v.length <= 500) || "Name must be between 3-500 chars"
        ],
        brand: [
          v => (v.length <= 100) || "Brand must be less than 100 chars"
        ],
        category: [
          v => (v.length <= 100) || "Category must be less than 100 chars"
        ],
        price: [
          v => (v && parseFloat(v) > 0) || "Price must be greater than 0"
        ],
      }
    },
    open() {
      this.opened = true;
      let self = this;
      Utility.doubleRaf(() => {
        self.$refs.form.resetValidation();
        self.$refs.code.focus();
      });
    },
    close() {
      this.opened = false;
      this.loading = false;
      this.rules = {};
      this.$refs.form.reset();
    },
    formatPrice() {
      this.form.price = parseFloat(('0' + this.form.price).replace(/[^\d.]/g, '')).toFixed(2);
    }
  }
};
</script>
