<template>
  <div>
    <div class="display-1">
      CSV file import
    </div>

    <p class="subtitle">
      Import your products from a CSV file
    </p>

    <p class="pt-5 mb-0">
      <v-form ref="form" v-model="valid">
        <v-file-input
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
    </p>

    <v-btn color="success" :dark="valid" :disabled="!valid" :loading="loading" @click="submit">Import</v-btn>

    <div class="pt-10">
      <h3>In order to import a CSV file successfully, please pay attention to the following rules</h3>

      <h4 class="mt-7">File rules</h4>
      <ul>
        <li>Only text format is acceptable</li>
        <li>Maximum allowed file size is 1024kb</li>
        <li>You can add a new products up to the limit in your plan</li>
        <li>Empty lines and description rows starting a hash # symbol are allowed</li>
      </ul>

      <h4 class="mt-5">Content format rules</h4>
      <ul>
        <li>Do not use thousand separator for price column</li>
        <li>Decimal point in price column can be a dot but not comma</li>
        <li>Code column can not be empty or duplicate</li>
        <li>Price column must be greater than zero</li>
        <li>Only Brand and Category columns can be empty</li>
      </ul>

      <h4 class="mt-5">Column rules</h4>
      <ul>
        <li>The column count must be 5</li>
        <li>The column order should be as follows
          <ul>
            <li>Code</li>
            <li>Name</li>
            <li>Brand</li>
            <li>Category</li>
            <li>Price</li>
          </ul>
        </li>
      </ul>
    </div>

    <div class="pt-5">
      <h3>Here is a valid CSV content</h3>
<pre>
  1. 0001,12-PIECE STAMPED STAINLESS-STEEL CUTLERY SET,HISAR,KITCHEN,19.99
  2. 0002,FISH KNIFE AND FORK 12 PIECES,WMF,KITCHEN,30.50
  3. 0003,MASTERCHIEF GOURMET ROBOT,SOLO,KITCHEN,1199.99
</pre>
    </div>

    <div class="pt-5">
      <h3>Another valid CSV content with description lines and empty columns</h3>
<pre>
  1. # CODE, NAME, BRAND, CATEGORY, PRICE
  2. 0001,12-PIECE STAMPED STAINLESS-STEEL CUTLERY SET,HISAR,KITCHEN,19.99
  3. 0002,FISH KNIFE AND FORK 12 PIECES,WMF,KITCHEN,30.50
  4. 
  5. 0003,MASTERCHIEF GOURMET ROBOT,,,1199.99
</pre>
    </div>

  </div>
</template>

<script>
import ImportService from '@/service/imbort';
import Utility from '@/helpers/utility';

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
      await this.$refs.fileInput.validate();
      if (this.valid) {
        this.loading = true;

        let formData = new FormData();
        formData.append('type', 'CSV');
        formData.append('file', this.file);

        const result = await ImportService.uploadCSV(formData);
        if (result.status == true) this.$router.push({ name: 'imported-prods' });
        this.loading = false;
      }
    }
  },
  mounted() {
    Utility.doubleRaf(() => this.$refs.fileInput.focus());
  }
};
</script>
