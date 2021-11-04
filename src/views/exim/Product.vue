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
        Upload
      </v-btn>
    </div>

    <div v-if="result != null" class="mt-2">
      <div>Result</div>
      <v-card>
        <table class="property-table">
          <tr v-if="result.total != null">
            <th width="10%">Total</th>
            <td>{{ result.total }}</td>
          </tr>
          <tr v-if="result.successCount != null">
            <th width="10%">Added</th>
            <td>{{ generateAddedStatement(result) }}</td>
          </tr>
          <tr>
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
            <li>The same is true for category and brand definitions</li>
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
              <th>Category</th>
              <td class="centered-col">NO</td>
              <td>
                <div>If given; it is automatically added among category definitions and bound to the product.</div>
                <div>Otherwise, you can pass this column empty if you want to give brand.</div>
                <div>
                  <b>Ex.: </b> MEN or ELECTRONICS
                </div>
              </td>
            </tr>
            <tr>
              <th>Brand</th>
              <td class="centered-col">NO</td>
              <td>
                <div>As is in the category description.</div>
                <div>
                  <b>Ex.: </b> APPLE or SAMSUNG
                </div>
              </td>
            </tr>
          </table>
        </v-card-text>
      </v-card>
    </div>

    <div v-if="result == null" class="mt-5">
      <div>Good example</div>
      <v-card class="mt-2" tile>
        <v-card-text>
          <div>HBV0000084U46,Marvel Legends Series Venom 6-inch Collectible Action Figure Toy,124.56,TOYS,MARVEL</div>
          <div>BV0001424174A,Golf Swami 6000 Handheld Golf GPS,149.99,SPORTS,GOLF</div>
          <div>B092Q6QNC1,70-Inch V-Series 4K UHD LED HDR Smart TV with Voice Remote,4789.25,ELECTRONICS,VIZIO</div>
          <div>T-001,Marvel Legends Series Venom 6-inch Collectible Action Figure Toy,124.56</div>
          <div>A-230,Golf Swami 6000 Handheld Golf GPS,149.99</div>
          <div>X-012,70-Inch V-Series 4K UHD LED HDR Smart TV with Voice Remote,4789.25</div>
        </v-card-text>
      </v-card>
    </div>

    <div v-if="result == null" class="mt-5">
      <div>Bad example</div>
      <v-card class="mt-2" tile>
        <v-card-text>
          <div>HBV0000084U46,Marvel Legends Series Venom 6-inch Collectible Action Figure Toy</div>
          <div>BV,Golf Swami 6000 Handheld Golf GPS,149.99,SPORTS,GOLF</div>
          <div>B092Q6QNC1,70,4789.25,ELECTRONICS,VIZIO</div>
          <div>T-001,Marvel Legends Series Venom 6-inch Collectible Action Figure Toy,0</div>
          <div>A-230,Golf Swami 6000 Handheld Golf GPS,-1</div>
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
            problems: [ `Failed to upload: ${res.data.reason}` ]
          };          
        }
      }).catch(err => {
        this.result = { 
          problems: [ `An error occurred: ${err.message}` ]
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
</style>