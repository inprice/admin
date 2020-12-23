<template>
  <div>
    <v-btn 
      small
      @click="$router.go(-1)">
        <v-icon class="mr-2">mdi-arrow-left-circle-outline</v-icon>
        Go Back
    </v-btn>

    <v-card class="mt-4">
      <v-card-title class="pb-2">
        <v-icon class="mr-4">mdi-cloud-upload-outline</v-icon>
        <div>
          <div>Ebay SKU List Import</div>
          <div class="caption">Please copy-paste your sku list in the text area below. Please consider the rules in the following sections</div>
        </div>

        <v-spacer></v-spacer>

        <v-btn 
          color="success" 
          :dark="valid" 
          :disabled="!valid" 
          :loading="loading" 
          @click="submit"
        >
          Import
        </v-btn>
      </v-card-title>

      <v-card-text class="pb-0">
        <v-form ref="form" v-model="valid">
          <v-textarea
            autofocus
            ref="contentInput"
            v-model="content"
            solo
            :show-size="1000"
            :rules="rules"
            :loading="loading"
            rows="8"
            wrap="off"
            @keypress="checkContentRowLimit"
          >
          </v-textarea>
        </v-form>
      </v-card-text>
    </v-card>

    <EbayRules />
  </div>

</template>

<script>
import ImportService from '@/service/imbort';

export default {
  data() {
    return {
      loading: false,
      valid: false,
      content: '',
      rules: [
        v => !!v || "Content is required",
        v => this.checkContentRowLimit(v) || "Content is out of limit. Max: 1024kb or 1mb and/or 100 rows",
      ],
    };
  },
  methods: {
    async submit() {
      this.$refs.contentInput.validate();
      if (this.valid) {
        this.loading = true;

        const result = await ImportService.uploadEbaySKUList(this.content);
        if (result.status == true) {
          this.$router.push({ name: 'import-details', params: { id: result.data.importId } });
        }
        this.loading = false;
      }
    },
    checkContentRowLimit() {
      if (this.content) {
        if (this.content.length > 1024000) {
          return false;
        } else {
          const rowCount = (this.content.match(/\n/g) || []).length+1;
          if (rowCount > 100) return false;
        }
      }
      return true;
    }
  },
  components: {
    EbayRules: () => import('./EbayRules'),
  },
};
</script>
