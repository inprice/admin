<template>
  <div>
    <div class="display-1">
      URL List import
    </div>

    <div v-if="resultSet && resultSet.length">
      <result-set :data="resultSet" title="URL list" />
    </div>

    <div v-else>
      <p class="subtitle">
        You can create your products from URLs of well known websites like Amazon and Ebay.
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
            accept=".txt" 
            label="Please click here to select a text file"
            prepend-icon=""
            append-icon="">
          </v-file-input>
        </v-form>
      </p>

      <v-btn color="success" :dark="valid" :disabled="!valid" :loading="loading" @click="submit">Import</v-btn>

      <div class="pt-10">
        <h3>In order to import a URL list successfully, please pay attention to the following rules</h3>

        <h4 class="mt-7">File rules</h4>
        <ul>
          <li>Only plain text format is acceptable</li>
          <li>Maximum allowed file size is 1024kb</li>
          <li>You can add a new products up to the limit in your plan</li>
          <li>Empty lines and description rows starting a hash # symbol are allowed</li>
        </ul>

        <h4 class="mt-5">Content format rules</h4>
        <ul>
          <li>Each row must have a valid URL which must start with <strong>http or https</strong></li>
          <li>URLs can be up to 1024 chars</li>
          <li>Lines can not be duplicate</li>
          <li>Only well known websites urls are accepted.</li>
        </ul>
      </div>

      <div class="pt-5">
        <h3>Here is a valid URL list</h3>
<pre>
  1. https://www.amazon.com/AmazonBasics-High-Speed-HDMI-Cable-1-Pack/dp/B014I8T0YQ
  2. https://www.ebay.com/itm/Xiaomi10-Pro-5G-12GB-256GB-12GB-512GB-Duel-Sim-Global-version-Google-store/133356161760
  3. https://www.debenhams.com/webapp/wcs/stores/servlet/prod_10701_10001_123010030399_-1
  4. https://www.zalando.co.uk/zign-polo-shirt-black-zi122p006-q11.html
  5. https://www.mediamarkt.de/de/product/_samsung-galaxy-tab-a-10-1-wi-fi-2586325.html
</pre>
      </div>
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
        formData.append('type', 'URL');
        formData.append('file', this.file);

        this.resultSet = [];
        const result = await ImportService.uploadURL(formData);
        if (result.status == true) this.resultSet = result.data;
        this.loading = false;
      }
    }
  },
  mounted() {
    Utility.doubleRaf(() => this.$refs.fileInput.focus());
  },
  components: {
    ResultSet: () => import('./ResultSet'),
  }
};
</script>
