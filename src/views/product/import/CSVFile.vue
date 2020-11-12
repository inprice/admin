<template>
  <div>
    <v-btn 
      small
      @click="$router.go(-1)">
        <v-icon class="mr-2">mdi-arrow-left-circle-outline</v-icon>
        Go Back
    </v-btn>

    <v-card class="mt-1">

      <v-card-title>
        <v-icon class="mr-4">mdi-cloud-upload-outline</v-icon>
        <div>
          <div>CSV File Import</div>
          <div class="caption">Please upload your CSV file considering the rules in the following sections</div>
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
      <v-card-title>
        <v-icon class="mr-2">mdi-playlist-check</v-icon>
        <div>File Rules</div>
      </v-card-title>

      <v-divider/>

      <v-card-text>
        <ol>
          <li>Only plain csv format is acceptable</li>
          <li>Maximum file size is 1024kb or 1mb</li>
          <li>You can add a new products up to the limit specified in your plan</li>
          <li>Empty lines and description rows starting with a hash # symbol are allowed</li>
        </ol>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title>
        <v-icon class="mr-2">mdi-format-columns</v-icon>
        <div>Content format rules</div>
      </v-card-title>

      <v-divider/>

      <v-card-text>
        <ol>
          <li>Do not use thousand separator for price column</li>
          <li>Decimal point in price column must be a dot but not comma</li>
          <li>Code column can not be empty or duplicate</li>
          <li>Price column must be greater than zero</li>
        </ol>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title>
        <v-icon class="mr-2">mdi-table-column</v-icon>
        <div>Column rules</div>
      </v-card-title>

      <v-divider/>

      <v-card-text>
        <ol>
          <li>The column count must be 3 and ordered as follows
            <div class="font-italic ml-4">Code, Name, Price</div>
          </li>
        </ol>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title>
        <v-icon class="mr-2">mdi-emoticon-outline</v-icon>
        <div>A valid CSV content</div>
      </v-card-title>

      <v-divider/>

      <v-card-text>
<pre>
0001,12-PIECE STAMPED STAINLESS-STEEL CUTLERY SET,19.99
0002,FISH KNIFE AND FORK 12 PIECES,30.50
0003,MASTERCHIEF GOURMET ROBOT,1199.99
</pre>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title>
        <v-icon class="mr-2">mdi-emoticon-outline</v-icon>
        <div>Another valid CSV content with description and empty lines</div>
      </v-card-title>

      <v-divider/>

      <v-card-text>
<pre>
# CODE, NAME, PRICE
0001,12-PIECE STAMPED STAINLESS-STEEL CUTLERY SET,19.99

0002,FISH KNIFE AND FORK 12 PIECES,30.50
0003,MASTERCHIEF GOURMET ROBOT,1199.99
</pre>
      </v-card-text>
    </v-card>
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

        const result = await ImportService.uploadCSV(formData);
        if (result.status == true) this.$router.push({ name: 'import-details', params: { id: result.data } });
        this.loading = false;
      }
    }
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
    margin-top: 20px;
  }
  .v-card__title {
    padding-bottom: 10px;
  }
  .v-card__text {
    padding-left: 10px;
  }
</style>