<template>
  <v-row justify="center">

    <v-dialog v-model="opened" max-width="400">
      <v-card>
        <v-card-title>Link URL</v-card-title>

        <v-card-text class="mt-5">
          <v-form ref="form" v-model="valid" @submit.prevent >
            <v-text-field
              ref="url"
              label="URL"
              v-model="form.url"
              :rules="rules.url"
              type="text"
              maxlength="2000"
            />
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
import LinkService from '@/service/link';
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
        url: '',
        productId: 0
      }
    };
  },
  methods: {
    async save() {
      if (Object.keys(this.rules).length == 0) this.activateRules();
      await this.$refs.form.validate();
      if (this.valid) {
        this.loading = true;
        const result = await LinkService.save(this.form);
        if (result == true) {
          this.close();
          this.$emit('saved');
          return;
        }
        this.loading = false;
      }
    },
    activateRules() {
      this.rules = {
        url: [
          v => !!v || "Required",
          v => /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/.test(v) || "Must be valid",
          v => (v && v.length >= 10 && v.length <= 2000) || "Must be longer than 10 chars"
        ],
      }
    },
    open(id, url, productId) {
      this.form.id = id;
      this.form.url = url;
      this.form.productId = productId;

      this.opened = true;
      let self = this;
      Utility.doubleRaf(() => {
        self.$refs.form.resetValidation();
        self.$refs.url.focus();
      });
    },
    close() {
      this.$refs.form.resetValidation();
      this.opened = false;
      this.loading = false;
    }
  }
};
</script>
