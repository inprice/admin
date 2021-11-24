<template>
  <div class="mt-3">

    <div>File</div>
    <v-file-input
      dense
      counter
      outlined
      class="mt-2"
      v-model="file"
      placeholder="Click here to load your file"
      prepend-icon=""
      accept="text/csv"
      :show-size="1000"
      @click:clear="clear"
      :disabled="loading"
      :loading="loading"
    >
      <template v-slot:selection="{ index, text }">
        <v-chip
          dark
          label
          small
          v-if="index < 2"
        >
          {{ text }}
        </v-chip>
        <span
          v-else-if="index === 2"
          class="text-overline grey--text text--darken-3 mx-2"
        >
          +{{ file.length - 2 }} File
        </span>
      </template>
    </v-file-input>

    <div class="d-flex justify-end mt-4">
      <v-btn 
        small
        class="mr-1"
        @click="clear"
        :disabled="file == undefined || loading"
      >
        Reset
      </v-btn>
      <v-btn 
        small
        color="success"
        class="ml-1"
        @click="upload" 
        :disabled="file == undefined || loading || result != null"
      >
        Import
      </v-btn>
    </div>

    <div v-if="result != null" class="mt-2">
      <div>Result</div>
      <v-card class="mt-2">
        <table class="property-table">
          <tr v-if="result.total != null">
            <th width="10%">Total</th>
            <td>{{ result.total }}</td>
          </tr>
          <tr v-if="result.successCount != null">
            <th width="10%">Added</th>
            <td>{{ generateAddedStatement(result) }}</td>
          </tr>
          <tr v-if="result.problems && result.problems.length">
            <th width="10%">Problems ({{ result.problems.length }})</th>
            <td>
              <div v-for="(problem, index) in result.problems" :key="index">{{ problem }}</div>
            </td>
          </tr>
        </table>
      </v-card>
    </div>

    <div v-if="result == null" class="mt-2">
      <div>Specific rules</div>
      <v-card class="mt-2" tile>
        <v-card-text>
          <ul>
            <li>Each column specified in the following table is mandatory</li>
            <li>It is not allowed to import duplicate urls for a product. Violations are ignored.</li>
          </ul>
        </v-card-text>
      </v-card>
    </div>

    <div v-if="result == null" class="mt-5">
      <div>Columns must be in the following order </div>
      <v-card class="mt-2" tile>
        <v-card-text>
          <table class="property-table">
            <tr>
              <th>Column</th>
              <td width="10%">Mandatory</td>
              <td>Description</td>
            </tr>
            <tr>
              <th>Product Sku</th>
              <td class="centered-col">YES</td>
              <td>
                <div>Each url must have a Sku code for a predefined product.</div>
                <div>
                  <b>Ex.: </b> HBV0000084U46
                </div>
              </td>
            </tr>
            <tr>
              <th>Link Url</th>
              <td class="centered-col">YES</td>
              <td>
                <div>Each row must contain a valid url.</div>
                <div>
                  <b>Ex.: </b> https://www.amazon.com/Marvel-Classic-Venom-Legends-Fade/dp/B084PV8MMJ
                </div>
              </td>
            </tr>
          </table>
        </v-card-text>
      </v-card>
    </div>

    <div v-if="result == null" class="mt-5">
      <div>Good examples</div>
      <v-card class="mt-2" tile>
        <v-card-text style="font-family: Courier;">
          <div class="teal--text">The following urls are saved under the product with Sku code of AMZ-745</div>
          <div>AMZ-745,https://www.amazon.com/Marvel-Classic-Venom-Legends-Fade/dp/B084PV8MMJ</div>
          <div>AMZ-745,https://www.amazon.com/Marvel-Classic-Venom-Legends-Ponytail/dp/B084ZRHP9L</div>
          <div>AMZ-745,https://www.amazon.com/Marvel-Legends-Series-6-inch-Carnage/dp/B076KPCX4R</div>

          <v-divider class="my-3"></v-divider>

          <div class="teal--text">The following urls will be saved under EBA-047 (1 url) and ETS-456 (2 urls)</div>
          <div>EBA-047,https://www.ebay.com/itm/143893348510</div>
          <div>ETS-456,https://www.etsy.com/listing/1103799745/christmas-tree-sweatshirt-merry-bright</div>
          <div>ETS-456,https://www.etsy.com/listing/295049483/crossbody-13-pm-crossbody-unique</div>
        </v-card-text>
      </v-card>
    </div>

    <div v-if="result == null" class="mt-5">
      <div>Bad examples</div>
      <v-card class="mt-2" tile>
        <v-card-text style="font-family: Courier;">
          <table class="csv-sample-table">
            <tr>
              <td>No Sku</td>
              <td>https://www.etsy.com/listing/1093121354/ugly-christmas-sweater-dress-vintage</td>
            </tr>
            <tr>
              <td>Empty Sku</td>
              <td>,https://www.etsy.com/listing/1093121354/ugly-christmas-sweater-dress-vintage</td>
            </tr>
            <tr>
              <td>Empty Url</td>
              <td>HBV0000084U46,</td>
            </tr>
            <tr>
              <td>No Url</td>
              <td>B076KPCX4R</td>
            </tr>
            <tr>
              <td>Invalid Url</td>
              <td>B084ZRHP9L,amazon.com/dp/B084PV8MMJ</td>
            </tr>
            <tr>
              <td>Invalid Url</td>
              <td>295049483,http://amazon.com/dp/B084PV8MMJ</td>
            </tr>
            <tr>
              <td>Invalid Url</td>
              <td>143893348510,http://localhost:7700/B084PV8MMJ</td>
            </tr>
          </table>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import ApiService from '@/service/api';

export default {
  data() {
    return {
      loading: false,
      file: null,
      result: null,
    };
  },
  methods: {
    upload() {
      if (!this.file) return;
      if (this.$store.get('session/isNotEditor') || this.$store.get('session/isDemoUser')) {
        this.$store.commit('snackbar/setMessage', { text: 'You are not allowed to import data!' });
        return;
      }

      this.loading = true;
      this.result = null;
      ApiService.uploadFile({
        file: this.file,
        url: `/exim/link/upload`
      }).then(res => {
        if (res && res.data) {
          if (res.data.status == 200) {
            this.result = res.data.data;
          } else {
            this.result = { 
              problems: [ `Failed to import: ${res.data.reason}` ]
            };
          }
        } else {
          this.result = { 
            problems: [ `Failed to import: ${res}` ]
          };
        }
      }).catch(err => {
        this.result = { 
          problems: [ `Server error: ${err.message}` ]
        };
      }).finally(() => this.loading = false);
    },
    clear() {
      this.loading = false;
      this.file = null;
      this.result = null;
    },
    generateAddedStatement(result) {
      if (result.successCount == 0) {
        return 'Failed, none of them is added!';
      } else if (result.successCount == result.total) {
        return 'All of them is successfully added.';
      } else {
        return result.successCount + ' link(s) successfully added.';
      } 
    }
  },
 }
</script>

<style scoped>
  .centered-col {
    vertical-align: top;
    text-align: center;
    font-weight: bold;
  }
  .csv-sample-table td:nth-child(1) {
    padding-right: 10px;
    color: teal;
  }
</style>