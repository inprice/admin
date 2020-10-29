<template>
  <div>
    <div class="display-1">
      Amazon's ASIN code list import
    </div>

    <div v-if="resultSet && resultSet.length">
      <result-set :data="resultSet" title="ASIN codes" />
    </div>

    <div v-else>

      <p class="subtitle">
        Import your products from a text file containing only Amazon's ASIN codes
      </p>

      <p class="pt-5 mb-0">
        <v-form ref="form" v-model="valid">
          <v-file-input
            autofocus
            v-model="file"
            large 
            outlined 
            counter
            :show-size="1000"
            :rules="rules"
            :loading="loading"
            accept=".txt" 
            label="Please click here to select a text file"
            prepend-icon=""
            append-icon="">
          </v-file-input>
        </v-form>
      </p>

      <v-btn color="success" :dark="valid" :disabled="!valid" :loading="loading" @click="submit">Import</v-btn>

      <div class="pt-10">
        <h3>In order to import a ASIN code list file successfully, please pay attention to the following rules</h3>

        <h4 class="mt-7">File rules</h4>
        <ul>
          <li>Only plain text format is acceptable</li>
          <li>Maximum allowed file size is 1024kb</li>
          <li>You can add a new products up to the limit in your plan</li>
          <li>Empty lines and description rows starting a hash # symbol are allowed</li>
        </ul>

        <h4 class="mt-5">Code format rules</h4>
        <ul>
          <li>Each row must have a valid ASIN code starting either <strong>B0</strong> or <strong>BT</strong></li>
          <li>The following characters should consist of 8 alpha numeric chars></li>
        </ul>

      </div>

      <div class="pt-5">
        <h3>Here is a valid ASIN code list content</h3>
  <pre>
    1. B00LH3DTYA
    2. B005GIQPCU
    3. BT0L2OMPNK
    4. BT0178MP0K
  </pre>
      </div>

      <div class="pt-5">
        <h3>Another valid code list with description lines</h3>
<pre>
  1. # -----------------------------------------
  2. # ASIN CODE LIST
  3. # -----------------------------------------
  4. B00LH3DTYA
  5. B005GIQPCU
  6.
  7. # -----------------------------------------
  8. # here is another description line
  9. # -----------------------------------------
 10. BT0L2OMPNK
 11. BT0178MP0K
</pre>
      </div>
    </div>

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
        v => (!v || v.type == 'text/plain') || "File type should be plain text",
        v => (!v || v.size > 32) || 'File size should be greater than 32 byte!',
        v => (!v || v.size < 1024001) || 'File size should be less than 1 MB!',
      ],
      resultSet: [],
    };
  },
  methods: {
    async submit() {
      this.$refs.fileInput.validate();
      if (this.valid) {
        this.loading = true;

        let formData = new FormData();
        formData.append('type', 'AMAZON_ASIN');
        formData.append('file', this.file);

        this.resultSet = [];
        const result = await ImportService.uploadAmazonASIN(formData);
        if (result.status == true) this.resultSet = result.data;
        this.loading = false;
      }
    }
  },
  components: {
    ResultSet: () => import('./ResultSet'),
  }
};
</script>
