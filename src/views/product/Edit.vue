<template>
  <v-row justify="center">

    <v-dialog v-model="opened" max-width="500">
      <v-card>
        <v-card-title>Product details</v-card-title>

        <v-card-text class="pb-0">

          <v-form ref="form" v-model="valid">
            <input type="hidden" :value="form.id" >

            <v-text-field
              ref="code"
              label="Code"
              v-model="form.code"
              :rules="rules.code"
              type="text"
              maxlength="50"
            />

            <v-text-field
              label="Name"
              v-model="form.name"
              :rules="rules.name"
              type="text"
              maxlength="500"
            />

            <v-text-field
              label="Price"
              v-model.lazy="form.price"
              :rules="rules.price"
              @blur="formatPrice"
              maxlength="10"
            />

            <v-row>
              <v-col>
                <ext-combo :value.sync="form.brandId" label="Brand" type="BRAND" />
              </v-col>
              <v-col>
                <ext-combo :value.sync="form.categoryId" label="Category" type="CATEGORY" />
              </v-col>
            </v-row>
          </v-form>

        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn @click="close">Close</v-btn>
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
import Utility from '@/helpers/utility';

export default {
  data() {
    return {
      opened: false,
      loading: false,
      valid: false,
      rules: {},
      form: {
        id: null,
        code: '',
        name: '',
        price: 0,
        brandId: null,
        categoryId: null
      }
    };
  },
  methods: {
    open(data) {
      this.opened = true;
      let self = this;
      Utility.doubleRaf(() => {
        self.$refs.form.resetValidation();
        if (data) this.form = data;
        self.$refs.code.focus();
      });
    },
    async save() {
      this.activateRules();
      await this.$refs.form.validate();
      if (this.valid) {
        this.loading = true;
        this.form.price = parseFloat(this.form.price);
        this.$emit('save', this.form)
      }
    },
    stopLoading() {
      this.loading = false;
    },
    close() {
      this.opened = false;
      this.loading = false;
      this.rules = {};
      this.$refs.form.reset();
    },
    activateRules() {
      this.rules = {
        code: [
          v => !!v || "Code is required",
          v => (v.length >= 3 && v.length <= 50) || "Code must be between 3-50 chars"
        ],
        name: [
          v => !!v || "Name is required",
          v => (v.length >= 3 && v.length <= 500) || "Name must be between 3-500 chars"
        ],
        price: [
          v => (v && parseFloat(v) > 0) || "Price must be greater than 0"
        ],
      }
    },
    formatPrice() {
      this.form.price = parseFloat(('0' + this.form.price).replace(/[^\d.]/g, '')).toFixed(2);
    }
  },
  components: {
    ExtCombo: () => import('@/component/input/ExtCombo.vue'),
  }
};
</script>
