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
            <th width="10%">Problems</th>
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
            <li>First three columns specified in the following table are mandatory</li>
            <li>Category and Brand columns can be left blank</li>
            <li>Otherwise, a new definition is added and bound to the product automatically</li>
            <li>Products are distinguished by Sku code. Duplicate or previously saved Sku codes will be ignored</li>
            <li>The same is true for category and brand names</li>
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
              <th>Sku</th>
              <td class="centered-col">YES</td>
              <td>
                <div>Each product must have a unique Sku code between 3 and 50 characters long.</div>
                <div>
                  <b>Ex.: </b> HBV0000084U46
                </div>
              </td>
            </tr>
            <tr>
              <th>Name</th>
              <td class="centered-col">YES</td>
              <td>
                <div>Product name must be between 3 and 250 characters long.</div>
                <div>
                  <b>Ex.: </b> Marvel Legends Series Venom 6-inch Collectible Action Figure Toy
                </div>
              </td>
            </tr>
            <tr>
              <th>Price</th>
              <td class="centered-col">YES</td>
              <td>
                <div>Price must be greater than zero. Decimal separator is period. No need a currency symbol</div>
                <div>
                  <b>Ex.: </b> 124.56
                </div>
              </td>
            </tr>
            <tr>
              <th>Brand</th>
              <td class="centered-col">NO</td>
              <td>
                <div>If given; it is automatically added into brand definitions and bound to the product.</div>
                <div>if you do not want to specify a brand for a product, simply left this column blank.</div>
                <div>
                  <b>Ex.: </b> APPLE or SAMSUNG
                </div>
              </td>
            </tr>
            <tr>
              <th>Category</th>
              <td class="centered-col">NO</td>
              <td>
                <div>As is in the brand description.</div>
                <div>
                  <b>Ex.: </b> MEN or ELECTRONICS
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
          <div class="teal--text">With Brands and Categories</div>
          <div>BV0001424174A,Golf Swami 6000 Handheld Golf GPS,149.99,GOLF,SPORTS</div>
          <div>295049483,Crossbody 13 p.m. Crossbody Unique Handbags Handmade,2543.20,MK,ACCESSORIES</div>

          <v-divider class="my-3"></v-divider>

          <div class="mt-2 teal--text">Without Brands</div>
          <div>B092Q6QNC1,70-Inch V-Series 4K UHD LED HDR Smart TV with Voice Remote,4789.25,,ELECTRONICS</div>
          <div>A292P78ND1,Samsung 70" 8K UHD TV,11789.25,,ELECTRONICS</div>

          <v-divider class="my-3"></v-divider>

          <div class="mt-2 teal--text">Without Categories</div>
          <div>HBV0000084U46,Marvel Legends Series Venom 6-inch Collectible Action Figure Toy,124.56,MARVEL</div>
          <div>00711202279438,Canon 4000d kit 18-55 IS II Black,695.00,CANON,</div>

          <v-divider class="my-3"></v-divider>

          <div class="mt-2 teal--text">Without Brands and Categories</div>
          <div>A-230,Golf Swami 6000 Handheld Golf GPS,149.99</div>
          <div>X-012,70-Inch V-Series 4K UHD LED HDR Smart TV with Voice Remote,4789.25,,</div>
        </v-card-text>
      </v-card>
    </div>

    <div v-if="result == null" class="mt-5">
      <div>Bad examples</div>
      <v-card class="mt-2" tile>
        <v-card-text style="font-family: Courier;">
          <table class="csv-sample-table">
            <tr>
              <td>Short Sku</td>
              <td>BV,Golf Swami 6000 Handheld Golf GPS,149.99,SPORTS,GOLF</td>
            </tr>
            <tr>
              <td>Short Name</td>
              <td>B092Q6QNC1,AP,4789.25,ELECTRONICS,VIZIO</td>
            </tr>
            <tr>
              <td>No price</td>
              <td>HBV0000084U46,Marvel Legends Series Venom 6-inch Collectible Action Figure Toy</td>
            </tr>
            <tr>
              <td>Zero Price</td>
              <td>T-001,Marvel Legends Series Venom 6-inch Collectible Action Figure Toy,0</td>
            </tr>
            <tr>
              <td>Negative Price</td>
              <td>A-230,Golf Swami 6000 Handheld Golf GPS,-1</td>
            </tr>
            <tr>
              <td>Too many columns</td>
              <td>BV,Golf, Swami, 6000, Handheld, Golf, GPS,149.99,SPORTS,GOLF</td>
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
      this.loading = true;
      this.result = null;
      ApiService.uploadFile({
        file: this.file,
        url: `/exim/product/upload`
      }).then(res => {
        if (res && res.data.status == 200) {
          this.result = res.data.data;
        } else {
          this.result = { 
            problems: [ `Failed to import: ${res.data.reason}` ]
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
        return 'None of them is added!';
      } else if (result.successCount == result.total) {
        return 'All of them is added.';
      } else {
        return result.successCount + 'product(s) added';
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