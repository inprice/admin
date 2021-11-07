<template>
  <v-card class="subtitle pb-5 px-1" :loading="loading" outlined>
    <v-card-title>
      <span class="text-capitalize">{{ entityName | pluralize }}</span>
    </v-card-title>

    <v-divider></v-divider>

    <v-card-text class="d-flex justify-space-between">
      To download all your {{ entityName }} definitions in CSV format, please click the button
    </v-card-text>

    <div class="d-flex justify-end pr-4">
      <v-btn 
        small
        color="primary"
        @click="download" 
        :disabled="loading"
      >
        Download
      </v-btn>
    </div>
  </v-card>
</template>

<script>
import ApiService from '@/service/api';

export default {
  props: [ 'entityName' ],
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    download() {
      this.loading = true;
      ApiService.downloadFile(
        {
          url: `/exim/${this.entityName}/download`, 
          fileName: this.pluralize(this.entityName) + '.csv'
        }
      ).finally(() => this.loading = false);
    }
  }
}
</script>
