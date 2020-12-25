<template>
  <div>
    <v-btn 
      small
      @click="$router.go(-1)">
        <v-icon class="mr-2">mdi-arrow-left-circle-outline</v-icon>
        Go Back
    </v-btn>

    <v-card>
      <v-card-title class="pb-2">
        <v-icon class="mr-4">mdi-cloud-upload-outline</v-icon>
        <div>
          <div>CSV File Import</div>
          <div class="caption">Please upload your CSV file considering the rules in the following sections</div>
        </div>

        <v-spacer></v-spacer>

        <v-btn 
          color="success" 
          :class="{'white--text': valid }"
          :disabled="!valid" 
          :loading="loading" 
          @click="submit"
        >
          Import
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-file-input
            autofocus
            ref="fileInput"
            v-model="file"
            large 
            outlined 
            counter
            :show-size="1000"
            :rules="rules"
            :loading="loading"
            accept=".csv" 
            label="Please click here to select a CSV file"
            prepend-icon=""
            append-icon="">
          </v-file-input>
        </v-form>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title class="pb-2">
        <v-icon class="mr-2">mdi-playlist-check</v-icon>
        <div>File Rules</div>
      </v-card-title>

      <v-divider/>

      <v-card-text>
        <ol>
          <li>Only plain csv format is acceptable</li>
          <li>Maximum file size is 1024kb or 1mb</li>
          <li>You can import new products up to the limit specified in your plan</li>
          <li>Empty lines and description rows starting with a hash # symbol are allowed</li>
        </ol>
      </v-card-text>
    </v-card>

    <CSVRules />
  </div>

</template>

<script>
import ImportService from '@/service/imbort';

export default {
  data() {
    return {
      loading: false,
      valid: false,
      file: {},
      rules: [
        v => !!v || "File is required",
        v => (!v || v.type == 'text/csv') || "File type should be CSV",
        v => (!v || v.size > 32) || 'File size should be greater than 32 byte!',
        v => (!v || v.size < 1024001) || 'File size should be less than 1 MB!',
      ],
    };
  },
  methods: {
    async submit() {
      this.$refs.fileInput.validate();
      if (this.valid) {
        this.loading = true;

        let formData = new FormData();
        formData.append('type', 'CSV');
        formData.append('file', this.file);

        const result = await ImportService.uploadCSVFile(formData);
        if (result.status == true) {
          if (result.data.successes) {
            this.$router.push({ name: 'products' });
          } else {
            this.$router.push({ name: 'import-details', params: { id: result.data.importId } });
          }
        }
        this.loading = false;
      }
    }
  },
  components: {
    CSVRules: () => import('./CSVRules'),
  },
};
</script>

<style scoped>
  ol {
    counter-reset: list;
  }
  ol > li {
    list-style: none;
  }
  ol > li:before {
    content: counter(list) ") ";
    counter-increment: list;
    font-weight: bold;
  }
  .v-card {
    margin-top: 15px;
  }
</style>
