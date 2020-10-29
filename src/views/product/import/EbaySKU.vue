<template>
  <div>
    <div class="display-1">
      Ebay's SKU code list import
    </div>

    <div v-if="resultSet && resultSet.length">
      <result-set :data="resultSet" title="SKU codes" />
    </div>

    <div v-else>
      <p class="subtitle">
        Import your products from a text file containing only Ebay's SKU codes
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
        <h3>In order to import a SKU code list file successfully, please pay attention to the following rules</h3>

        <h4 class="mt-7">File rules</h4>
        <ul>
          <li>Only plain text format is acceptable</li>
          <li>Maximum allowed file size is 1024kb</li>
          <li>You can add a new products up to the limit in your plan</li>
          <li>Empty lines and description rows starting a hash # symbol are allowed</li>
        </ul>

        <h4 class="mt-5">Code format rules</h4>
        <ul>
          <li>Each row must have a valid SKU code which must start with <strong>1, 2, </strong> or <strong>3</strong></li>
          <li>The followings should consist of 10 or 11 digits</li>
        </ul>

      </div>

      <div class="pt-5">
        <h3>Here is a valid SKU code list content</h3>
<pre>
  1. 183767351247
  2. 16034214202
  3. 26363095820
  4. 191732626551
</pre>
      </div>

      <div class="pt-5">
        <h3>Another valid code list with description lines</h3>
<pre>
  1. # -----------------------------------------
  2. # SKU CODE LIST
  3. # -----------------------------------------
  4. 183767351247
  5. 16034214202
  6.
  7. # -----------------------------------------
  8. # here is another description line
  9. # -----------------------------------------
10. 26363095820
11. 191732626551
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
        formData.append('type', 'EBAY_SKU');
        formData.append('file', this.file);

        this.resultSet = [];
        const result = await ImportService.uploadEbaySKU(formData);
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
